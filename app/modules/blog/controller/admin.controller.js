const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const blogRepo = require("../repositories/blog.repository");

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
      let blogData = await blogRepo.getAll(req);
      // console.log(blogData);
      res.render("blog/views/list.ejs", {
        title: "list page",
        data: blogData.docs,
      });
    } catch (error) {
      throw error;
    }
  }

  /* @Method: getAll
  // @Description: To get all the Blogs from DB
  */


  async getAll(req, res) {
    try {
      let page = req.body.page || 1; // Default page
      let perpage = req.body.perpage || 10; // Default items per page

      let blogData = await blogRepo.getAll(req, page, perpage);

      let meta = {
        page: page,
        pages: Math.ceil(blogData.total / perpage),
        perpage: perpage,
        total: blogData.total,
      };

      return {
        status: 200,
        meta: meta,
        data: blogData.docs,
        message: `Data fetched successfully.`,
      };
    } catch (e) {
      console.error("Error in getAll:", e); // Log the error
      return { status: 500, data: [], message: e.message };
    }
  }

  /*
  // @Method: insert
  // @Description:  Insert Blog into DB
  */

  async insert(req, res) {
    try {
      // console.log(req.body);
      let checktitle = await blogRepo.getByField({
        // isDeleted: false,
        title: req.body.title.trim(),
      });
      if (!_.isEmpty(checktitle)) {
        console.log("error", "Sorry, Blog already exists with this title.");
        res.redirect(namedRouter.urlFor("blog.form"));
      } else {
        let saveData = await blogRepo.save(req.body);
        if (!_.isEmpty(saveData) && saveData._id) {
          console.log("success", "Blog Added Successfully!");
          res.redirect(namedRouter.urlFor("blog.list"));
        } else {
          console.log("error", "Blog Not Added Successfully!");
          res.redirect(namedRouter.urlFor("blog.create"));
        }
      }
    } catch (err) {
      // const error = errorHandler(e);
      // console.log("error", error.message);
      res.redirect(namedRouter.urlFor("blog.form"));
      console.log(err);
      throw err;
    }
  }

  /**
   * @Method edit
   * @Description To Show The Edit Form
   */
  async edit(req, res) {
    try {
      let blogData = await blogRepo.getById(req.params.id);
      if (!_.isEmpty(blogData)) {
        res.render("blog/views/edit", {
          response: blogData,
        });
      } else {
        console.log("error", "Blog Not Found!");
        res.redirect(namedRouter.urlFor("blog.list"));
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @Method update
   * @Description To Update Data
   */
  async update(req, res) {
    try {
      req.body.title = req.body.title.trim();
      if (_.isEmpty(req.body.title)) {
        console.log("error", "Field should not be empty!");
        res.redirect(namedRouter.urlFor("blog.create"));
      } else {
        const blogId = req.body.id;
        let isTitleExists = await blogRepo.getByField({
          title: { $regex: "^" + req.body.title.trim() + "$", $options: "i" },
          _id: { $ne: blogId },
          isDeleted: false,
        });
        if (!_.isEmpty(isTitleExists)) {
          console.log("error", "Title Already Exists!");
          res.redirect(namedRouter.urlFor("blog.edit", { id: blogId }));
        } else {
          let blogData = await blogRepo.getById(blogId);
          let blogUpdate = await blogRepo.updateById(req.body, blogId);
          if (!_.isEmpty(blogUpdate) && blogUpdate._id) {
            console.log("success", "Blog Updated Successfully");
            res.redirect(namedRouter.urlFor("blog.list"));
          } else {
            console.log("error", "Blog Failed To Update!");
            res.redirect(namedRouter.urlFor("blog.list"));
          }
        }
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @Method delete
   * @Description Delete Data
   */
  async delete(req, res) {
    console.log("Yes");
    try {
      let blogDeletedData = await blogRepo.getById(req.params.id);
      if (!_.isEmpty(blogDeletedData)) {
        let blogDelete = await blogRepo.updateById(
          { isDeleted: true },
          blogDeletedData._id
        );
        if (!_.isEmpty(blogDelete) && blogDelete._id) {
          console.log("success", "Blog Deleted Successfully");
          res.redirect(namedRouter.urlFor("blog.list"));
        } else {
          console.log("error", "Sorry Blog Not Deleted");
          res.redirect(namedRouter.urlFor("blog.list"));
        }
      } else {
        console.log("error", "Sorry Blog not found");
        res.redirect(namedRouter.urlFor("blog.list"));
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AdminControllers();
