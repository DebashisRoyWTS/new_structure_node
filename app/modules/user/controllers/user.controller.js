const mongoose = require("mongoose");
const User = require("user/model/user.model");
const userRepo = require("user/repositories/user.repositories");
const roleRepo = require("role/repositories/role.repository");
const blogRepo = require("blog/repositories/blog.repository");
const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const gm = require("gm").subClass({
  imageMagick: true,
});
const fs = require("fs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

class UserController {
  constructor() {
    this.users = [];
  }

  /* @Method: login
    // @Description: user Login Render
    */
  async login(req, res) {
    if (req.session && req.session.token) {
      res.redirect(namedRouter.urlFor("user.dashboard"));
    } else {
      res.render("user/views/login.ejs");
    }
  }

  /* @Method: signin
    // @Description: user Login
    */

  async signin(req, res) {
    try {
      req.body.email = req.body.email.trim().toLowerCase();
      let roles = await roleRepo.getDistinctDocument("_id", {
        rolegroup: "admin",
        isDeleted: false,
      });
      req.body.roles = roles;
      let userData = await userRepo.fineOneWithRole(req.body);
      if (userData.status == 500) {
        console.log("error", userData.message);
        return res.redirect(namedRouter.urlFor("user.login"));
      }
      let user = userData.data;
      if (user.status == "Inactive") {
        console.log("error", "Account was set inactive by the Administrator");
        return res.redirect(namedRouter.urlFor("user.login"));
      } else if (user.status == "true") {
        console.log("error", "Account was Banned by the Administrator");
        return res.redirect(namedRouter.urlFor("user.login"));
      } else if (!_.isEmpty(user.role)) {
        const payload = {
          id: user._id,
        };

        let token = jwt.sign(payload, config.auth.jwtSecret, {
          expiresIn: config.auth.jwt_expiresin.toString(), // token expiration time
        });

        req.session.token = token;
        req.user = user;

        console.log("success", "You have successfully logged in");
        return res.redirect(namedRouter.urlFor("user.dashboard"));
      } else {
        console.log(
          "error",
          "Authentication failed. You are not a valid user."
        );
        return res.redirect(namedRouter.urlFor("user.login"));
      }
    } catch (err) {
      throw err;
    }
  }

  /* @Method: create
    // @Description: user create view render
    */
  async create(req, res) {
    try {
      let success = {};
      let roles = await roleRepo.getAllByField({
        isDeleted: false,
        rolegroup: "admin",
      });
      success.roles = roles;
      console.log("Roles=>", success);

      res.render("user/views/add.ejs", {
        page_title: "User Create",
        user: req.user,
        response: success,
      });
    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  }

  /* @Method: insert
   // @Description: save User
   */
  async insert(req, res) {
    try {
      const newUser = new User();

      req.body.password = newUser.generateHash(req.body.password);
      req.body.email = req.body.email.trim().toLowerCase();

      if (req.body.first_name && req.body.last_name) {
        req.body.full_name = req.body.first_name + " " + req.body.last_name;
      }

      var chk = { isDeleted: false, email: req.body.email };
      let checkEmail = await userRepo.getByField(chk);
      if (!_.isEmpty(checkEmail)) {
        console.log("error", "Sorry, User already exist with this email.");
        res.redirect(namedRouter.urlFor("user.create"));
      } else {
        if (req.files && req.files.length > 0) {
          gm("./public/uploads/user/" + req.files[0].filename)
            .resize(100)
            .write(
              "./public/uploads/user/thumb/" + req.files[0].filename,
              function (err, result) {
                //if (!err) console.log('done');
              }
            );
          req.body.profile_image = req.files[0].filename;
        }

        let saveUser = await userRepo.save(req.body);
        if (_.isObject(saveUser) && saveUser._id) {
          console.log("success", "User created successfully");
          res.redirect(namedRouter.urlFor("user.listing"));
        } else {
          console.log("error", "Failed to create new user");
          res.redirect(namedRouter.urlFor("user.listing"));
        }
      }
    } catch (e) {
      console.log(e.message);
      console.log("error", e.message);
      //res.status(500).send({message: error.message});
      res.redirect(namedRouter.urlFor("user.create"));
    }
  }

  /* @Method: list
    // @Description: To get all the user from DB
    */
  async list(req, res) {
    try {
      // console.log('connected');
      let active = false;
      if (req.query.active) {
        active = true;
      }
      let user_type = "";
      if (req.query.user_type) {
        // console.log('req.query.user_type) before', req.query.user_type);
        user_type = req.query.user_type;
        // console.log('req.query.user_type) after', req.query.user_type);
      }

      // let roles = await roleRepo.getAllByField({ "isDeleted": false, "rolegroup": "user" });
      // roles = roles;

      res.render("user/views/list.ejs");
    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  }

  /* @Method: getAllUser
    // @Description: To get all the user from DB
    */
  async getAllUser(req, res) {
    try {
      //req.body.roles = ["customer", "technician"]
      req.body.role = "user";

      if (_.has(req.body, "sort")) {
        var sortOrder = req.body.sort.sort;
        var sortField = req.body.sort.field;
      } else {
        var sortOrder = -1;
        var sortField = "_id";
      }

      if (!_.has(req.body, "pagination")) {
        req.body.pagination.page = 1;
        req.body.pagination.perpage = config.other.pageLimit;
      }

      let user = await userRepo.getAllUsers(req);

      // console.log(user, ' ***************************** ');

      let meta = {
        page: req.body.pagination.page,
        pages: user.pages,
        perpage: req.body.pagination.perpage,
        total: user.total,
        sort: sortOrder,
        field: sortField,
      };
      return {
        status: 200,
        meta: meta,
        data: user.docs,
        message: `Data fetched successfully.`,
      };
    } catch (e) {
      return {
        status: 500,
        data: [],
        message: e.message,
      };
    }
  }

  /**
   * @Method: edit
   * @Description: To edit user information
   */
  //   async edit(req, res) {
  //     try {
  //       let result = {};
  //       let userData = await userRepo.getById(req.params.id);
  //       let badgeList = await badgeRepo.getAllByField({ isDeleted: false });
  //       if (!_.isEmpty(userData)) {
  //         let roles = await roleRepo.getAllByField({
  //           isDeleted: false,
  //           rolegroup: "user",
  //         });
  //         result.roles = roles;
  //         result.user_data = userData;
  //         res.render("user/views/edit.ejs", {
  //           page_name: "user-management",
  //           page_title: "User Edit",
  //           user: req.user,
  //           response: result,
  //           countries: countries,
  //           badgeList,
  //         });
  //       } else {
  //         console.log("error", "Sorry user not found!");
  //         res.redirect(namedRouter.urlFor("user.listing"));
  //       }
  //     } catch (e) {
  //       throw e;
  //     }
  //   }

  /**
   * @Method: update
   * @Description: update user information action
   */
  //   async update(req, res) {
  //     try {
  //       req.body.email = req.body.email.trim().toLowerCase();
  //       let chkEmail = {
  //         isDeleted: false,
  //         email: { $regex: "^" + req.body.email + "$", $options: "i" },
  //         _id: { $ne: mongoose.Types.ObjectId(req.body.uid) },
  //       };
  //       let checkEmail = await userRepo.getByField(chkEmail);
  //       if (!_.isEmpty(checkEmail)) {
  //         console.log("error", "Email already used for another account.");
  //         res.redirect(
  //           namedRouter.urlFor("user.edit", {
  //             id: req.body.uid,
  //           })
  //         );
  //       } else {
  //         if (req.body.country_code) {
  //           req.body.country_code = req.body.country_code.replace("+", "");
  //         }

  //         if (req.body.phone) {
  //           req.body.phone = req.body.phone.replace(/[^0-9]/g, "");
  //         }

  //         if (req.body.first_name && req.body.last_name) {
  //           req.body.full_name = req.body.first_name + " " + req.body.last_name;
  //         }

  //         let userdata = await userRepo.getById(req.body.uid);
  //         if (req.files && req.files.length > 0) {
  //           let gallery_arr = [];
  //           let technician_document = "";
  //           for (let file of req.files) {
  //             if (file.fieldname == "image_gallery") {
  //               gallery_arr.push(file.filename);
  //             }
  //             if (file.fieldname == "technician_document") {
  //               technician_document = file.filename;
  //             } else {
  //               if (userdata.profile_image && file.fieldname == "profile_image") {
  //                 if (
  //                   fs.existsSync(
  //                     "./public/uploads/user/profile_pic/" +
  //                       userdata.profile_image
  //                   ) &&
  //                   userdata.profile_image
  //                 ) {
  //                   fs.unlinkSync(
  //                     "./public/uploads/user/profile_pic/" +
  //                       userdata.profile_image
  //                   );
  //                 }
  //               }
  //               gm("./public/uploads/user/" + file.filename)
  //                 .resize(100)
  //                 .write(
  //                   "./public/uploads/user/thumb/" + file.filename,
  //                   function (err, result) {
  //                     //if (!err) console.log('done');
  //                   }
  //                 );
  //               req.body[file.fieldname] = file.filename;
  //             }
  //           }
  //           if (gallery_arr.length) {
  //             let pushData = { $push: { image_gallery: gallery_arr } };
  //             req.body = Object.assign(req.body, pushData);
  //           }
  //           if (technician_document) {
  //             let techpushData = { technician_document: technician_document };
  //             req.body = Object.assign(req.body, techpushData);
  //           }
  //         }

  //         if (req.body.latitude && req.body.longitude) {
  //           let coordinates = [];
  //           coordinates.push(parseFloat(req.body.longitude));
  //           coordinates.push(parseFloat(req.body.latitude));

  //           var geo_location = {
  //             type: "Point",
  //             coordinates: coordinates,
  //           };
  //           req.body.geo_loc = geo_location;
  //         }

  //         if (req.body.account_verified && req.body.account_verified == "true") {
  //           req.body.account_verified = true;
  //         } else if (
  //           req.body.account_verified &&
  //           req.body.account_verified == "false"
  //         ) {
  //           req.body.account_verified = false;
  //         }

  //         let arr = [];
  //         if (
  //           req.body.week_day &&
  //           Array.isArray(req.body.week_day) &&
  //           req.body.timing &&
  //           Array.isArray(req.body.timing)
  //         ) {
  //           req.body.week_day.forEach((element, index) => {
  //             arr.push({ week_day: element, timing: req.body.timing[index] });
  //           });
  //           req.body.business_hours = arr;
  //         } else if (req.body.week_day && req.body.timing) {
  //           arr.push({ week_day: req.body.week_day, timing: req.body.timing });
  //           req.body.business_hours = arr;
  //         }
  //         // console.log(req.body, "req.body");
  //         let userUpdate = await userRepo.updateById(
  //           req.body,
  //           mongoose.Types.ObjectId(req.body.uid)
  //         );
  //         //  console.log('userUpdate', userUpdate);
  //         if (_.isObject(userUpdate) && userUpdate._id) {
  //           console.log("success", "User updated successfully.");
  //           res.redirect(namedRouter.urlFor("user.listing"));
  //         } else {
  //           console.log("error", "Failed to update User.");
  //           res.redirect(
  //             namedRouter.urlFor("admin.user.edit", {
  //               id: req.body.uid,
  //             })
  //           );
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       throw e;
  //     }
  //   }

  /* @Method: delete
    // @Description: user Delete
    */
  //   async delete(req, res) {
  //     try {
  //       let userDelete = await userRepo.updateById(
  //         {
  //           isDeleted: true,
  //         },
  //         req.params.id
  //       );
  //       if (!_.isEmpty(userDelete)) {
  //         let serviceData = await serviceRepo.getByField({
  //           user_id: mongoose.Types.ObjectId(req.params.id),
  //         });
  //         //   console.log( ('serviceData =====', serviceData));
  //         if (serviceData) {
  //           let serviceDelete = await serviceRepo.updateById(serviceData.id, {
  //             isDeleted: true,
  //           });
  //         }

  //         let studioData = await studioRepo.getByField({
  //           user_id: mongoose.Types.ObjectId(req.params.id),
  //         });
  //         // console.log('studioData --------------------- ', studioData);
  //         if (studioData) {
  //           let studioDelete = await studioRepo.updateById(studioData.id, {
  //             isDeleted: true,
  //           });
  //           // console.log('deleted studio', studioDelete.name, 'isDEleted', studioDelete.isDeleted);
  //         }

  //         let jobData = await jobRepo.getByField({
  //           user_id: mongoose.Types.ObjectId(req.params.id),
  //         });
  //         // console.log('jobData --------------------- ', jobData);
  //         if (jobData) {
  //           let jobDelete = await jobRepo.updateById(
  //             {
  //               isDeleted: true,
  //             },
  //             jobData.id
  //           );
  //           // console.log('deleted studio', studioDelete.name, 'isDEleted', studioDelete.isDeleted);
  //         }

  //         let trainingData = await trainingRepo.getByField({
  //           user_id: mongoose.Types.ObjectId(req.params.id),
  //         });
  //         // console.log('studioData --------------------- ', studioData);
  //         if (trainingData) {
  //           let trainingDelete = await trainingRepo.updateById(trainingData.id, {
  //             isDeleted: true,
  //           });
  //           // console.log('deleted studio', studioDelete.name, 'isDEleted', studioDelete.isDeleted);
  //         }

  //         // Emit the "user-inactive" event to connected sockets
  //         io.emit("user-inactive", {
  //           userId: userDelete._id,
  //           userStatus: userDelete.userStatus,
  //           isDeleted: userDelete.isDeleted,
  //           isBanned: userDelete.isBanned,
  //         });

  //         //   console.log('emitted');
  //         console.log("success", "User has been deleted successfully");
  //         res.redirect(namedRouter.urlFor("user.listing"));
  //       }
  //     } catch (e) {
  //       return res.status(500).send({
  //         message: e.message,
  //       });
  //     }
  //   }

  /* 
  //  @Method: Dashboard
    // @Description: User Dashboard
    */

  async dashboard(req, res) {
    try {
      let userRole = await roleRepo.getByField({ role: "admin" });

      // for User Statistics
      let totalUsers = await userRepo.getUserCountByParam({
        isDeleted: false,
        role: userRole._id,
      });
      console.log(totalUsers);
      let activeUsers = await userRepo.getUserCountByParam({
        isDeleted: false,
        isActive: "true",
        role: userRole._id,
      });
      let bannedUsers = await userRepo.getUserCountByParam({
        isDeleted: false,
        isBanned: "true",
        role: userRole._id,
      });
      let inActiveUsers = await userRepo.getUserCountByParam({
        isDeleted: false,
        isActive: "false",
        role: userRole._id,
      });

      // for Blog Statistics
      let totalBlog = await blogRepo.getBlogCountByParam({ isDeleted: false });

      res.render("user/views/dashboard.ejs", {
        page_name: "user-dashboard",
        page_title: "Dashboard",
        user: req.user,
        // for user
        totalUsers,
        activeUsers,
        bannedUsers,
        inActiveUsers,

        // for Blog
        totalBlog,
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }

  /* @Method: Logout
    // @Description: User Logout
    */
  async logout(req, res) {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  }

  /* @Method: viewmyprofile
    // @Description: To get Profile Info from db
    */
  //  async viewmyprofile(req, res) {
  //      try {
  //          const id = req.params.id;
  //          let user = await userRepo.getById(id);
  //          if (!_.isEmpty(user)) {
  //              res.render('user/views/myprofile.ejs', {
  //                  page_name: 'user-profile',
  //                  page_title: 'My Profile',
  //                  user: req.user,
  //                  response: user
  //              });
  //          }
  //      } catch (e) {
  //          return res.status(500).send({
  //              message: e.message
  //          });
  //      }
  //  }

  /* @Method: updateprofile
    // @Description: Update My Profile 
    */
  async updateprofile(req, res) {
    try {
      const id = mongoose.Types.ObjectId(req.body.id);
      req.body.email = req.body.email.trim().toLowerCase();
      let userAvail = await userRepo.getByField({
        email: { $regex: "^" + req.body.email.trim() + "$", $options: "i" },
        _id: { $ne: id },
        isDeleted: false,
      });
      if (userAvail) {
        console.log(
          "error",
          "Email address already taken for some other account."
        );
        res.redirect(
          namedRouter.urlFor("admin.profile", {
            id: id,
          })
        );
      } else {
        let userUpdate = await userRepo.updateById(req.body, id);
        if (!_.isEmpty(userUpdate)) {
          console.log("success", "Profile updated successfully.");
          res.redirect(
            namedRouter.urlFor("admin.profile", {
              id: id,
            })
          );
        }
      }
    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  }
}

module.exports = new UserController();
