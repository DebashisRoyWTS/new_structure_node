const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const testimonalController = require("../../modules/testimonials/controllers/testimonial.controller");

// @Route to show the page as Listing

namedRouter.get(
  "testimonal.form",
  "/testimonial/form",
  testimonalController.testimonial
);

module.exports = router;
