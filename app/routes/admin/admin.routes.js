const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const adminController = require("../../modules/blog/controller/admin.controller");

// @Route to show the page as Listing

namedRouter.get("admin.list", "/admin/show", adminController.hello);

module.exports = router;
