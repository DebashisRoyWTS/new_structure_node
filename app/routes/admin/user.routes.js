const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require("multer");
const userController = require("user/controllers/user.controller");
const fs = require("fs");

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync("./public/uploads/user")) {
      fs.mkdirSync("./public/uploads/user");
    }
    callback(null, "./public/uploads/user");
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

namedRouter.get("user.create", "/user/create", userController.create);

namedRouter.post(
  "user.insert",
  "/user/insert",
  uploadFile.any(),
  userController.insert
);

// login render route
namedRouter.get("user.login", "/", userController.login);

// login process route
namedRouter.post("user.login.process", "/login", userController.signin);

namedRouter.all("/user*", auth.authenticate);

// dashboard route
namedRouter.get("user.dashboard", "/user/dashboard", userController.dashboard);

// User List
namedRouter.get("user.listing", "/user/listing", userController.list);

// Get All Users
namedRouter.post("user.getall", "/user/getall", async (req, res) => {
  try {
    const success = await userController.getAllUser(req, res);
    res.send({
      meta: success.meta,
      data: success.data,
    });
  } catch (error) {
    res.status(error.status).send(error);
  }
});

module.exports = router;
