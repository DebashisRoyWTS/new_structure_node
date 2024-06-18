const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const roleController = require("role/controllers/role.controller");
// const auth = require("../../middlewares/auth")();

const multer = require("multer");
const request_param = multer();

//authentication section of role
// namedRouter.all('/role*', auth.authenticate);

// admin role list route

namedRouter.post("role.getall", "/role/getall", async (req, res) => {
  try {
    const success = await roleController.getAll(req, res);
    res.send({ meta: success.meta, data: success.data });
  } catch (error) {
    res.status(error.status).send(error);
  }
});
namedRouter.get("role.create", "/role/create", roleController.create);
namedRouter.post(
  "role.store",
  "/role/store",
  request_param.any(),
  roleController.store
);
namedRouter.get("role.list", "/role/list", roleController.list);
namedRouter.get("role.edit", "/role/edit/:id", roleController.edit);
namedRouter.get("role.delete", "/role/delete/:id", roleController.delete);
namedRouter.post(
  "role.update",
  "/role/update",
  request_param.any(),
  roleController.update
);
// namedRouter.get("role.statusChange", '/role/status-change/:id',request_param.any(),roleController.statusChange);

//Export the express.Router() instance
module.exports = router;
