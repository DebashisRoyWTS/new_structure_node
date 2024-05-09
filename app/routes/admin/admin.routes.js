const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const adminController = require("../../modules/blog/controller/admin.controller");

// Route to show the page as Listing
namedRouter.post("blog.getall", "/blog/getall", async (req, res) => {
  try {
    const success = await adminController.getAll(req, res);
    console.log(success);
    res.send({
      meta: success.meta,
      data: success.data,
    });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
namedRouter.get("blog.form", "/blog/form", adminController.form);
namedRouter.get("blog.list", "/blog/list", adminController.list);
namedRouter.post("blog.insert", "/blog/insert", adminController.insert);
namedRouter.get("blog.edit", "/blog/edit/:id", adminController.edit);
namedRouter.post("blog.update", "/blog/update", adminController.update);
namedRouter.get("blog.delete", "/blog/delete/:id", adminController.delete);

module.exports = router;
