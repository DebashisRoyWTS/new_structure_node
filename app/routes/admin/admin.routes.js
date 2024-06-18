const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const adminController = require("blog/controller/admin.controller");
const multer = require("multer");
const fs = require("fs");

//file handle
const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync("./public/uploads/blog")) {
      fs.mkdirSync("./public/uploads/blog");
    }
    callback(null, "./public/uploads/blog");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_"));
  },
});

const uploadFile = multer({
  storage: Storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/png"
    ) {
      req.fileValidationError = "Only support jpeg, jpg or png file types.";
      return cb(
        null,
        false,
        new Error("Only support jpeg, jpg or png file types")
      );
    }
    cb(null, true);
  },
});

// namedRouter.all('/blog*', auth.authenticate);

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
namedRouter.post(
  "blog.insert",
  "/blog/insert",
  uploadFile.any(),
  adminController.insert
);
namedRouter.get("blog.edit", "/blog/edit/:id", adminController.edit);
namedRouter.post(
  "blog.update",
  "/blog/update",
  uploadFile.any(),
  adminController.update
);
namedRouter.get("blog.delete", "/blog/delete/:id", adminController.delete);

module.exports = router;
