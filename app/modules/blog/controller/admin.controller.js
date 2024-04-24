const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const blogRepo=require('../repositories/blog.repository')

class AdminControllers {

/**
 *  // @Method: form
 *  //@Description: To render Blog form 
 */

  async form(req, res) {
    try {
      // res.render("/admin/views/content.ejs");
      res.render("blog/views/add.ejs", {
        title: "content page",
      });
    } catch (error) {
      throw error;
    }
  }

/**
 *  // @Method: list
 *  //@Description: To render Blog list 
 */

  async list(req, res) {
    try {
      // res.render("/admin/views/content.ejs");
      res.render("blog/views/list.ejs", {
        title: "list page",
      });
    } catch (error) {
      throw error;
    }
  }

    /*
  // @Method: insert
  // @Description:  Insert Blog into DB
  */
 
  async insert(req, res) {
    try {
      console.log(req.body);
      // let checktitle = await blogRepo.getByField({ isDeleted: false, title: req.body.title.trim() });
      // if (!_.isEmpty(checktitle)) {
      //     req.flash('error', "Sorry, Blog already exists with this title.");
      //     res.redirect(namedRouter.urlFor("blog.form"));
      // } else {
      //   let saveblog = await blogRepo.save(req.body);
      //   if (_.isObject(saveblog)) {
      //       let allUsers = await userRepo.getAllByField({
      //         'isDeleted': false,
      //         '_id':{$ne:req.user._id}
      //       })
      
      //       let userData = allUsers.map(doc => {
      //         return {
      //           user_id: doc._id,
      //           message: "New blog added",
      //           ref_type: "Blog",
      //           ref_id: saveblog._id,
      //           isDeleted: false,
      //         };
      //       });
      //   }
      //   console.log("success", "Blog added successfully.");
      //   res.redirect(namedRouter.urlFor("blog.list"));
      // }
    } catch (e) {
      // const error = errorHandler(e);
      // console.log("error", error.message);
      // res.redirect(namedRouter.urlFor("blog.form"));
    }
  };
}

module.exports = new AdminControllers();
