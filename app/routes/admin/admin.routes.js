const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const adminController = require("../../modules/blog/controller/admin.controller");

// @Route to show the page as Listing

namedRouter.get("blog.form", "/blog/form", adminController.form);
namedRouter.get("blog.list", "/blog/list", adminController.list);
// namedRouter.get("blog.form", "/blog/form", adminController.blogForm);

module.exports = router;
