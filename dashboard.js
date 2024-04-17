// core modules
const { join, resolve } = require("path");
const http = require("http");
// 3rd party modules
const express = require("express");
const cors = require("cors");
const engine = require("ejs-locals");

const path = require("path");
// Import module in global scope
require("app-module-path").addPath(__dirname + "/app/modules");

require("dotenv").config();
_ = require("underscore");

// Import module in global scope
// require('app-module-path').addPath(__dirname + '/app/modules');
require("mongoose-pagination");
require("dotenv").config();
_ = require("underscore");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// custom modules will goes here
global.appRoot = join(__dirname, "/app");
config = require(resolve(join(__dirname, "app/config", "index")));
utils = require(resolve(join(__dirname, "app/helper", "utils")));
// global.auth = require(resolve(join(__dirname, 'app/middlewares', 'auth')))();
mailHelper = require(appRoot + "/helper/mailer");

// For track log //
// const Logger = require(resolve(join(__dirname, 'app/helper', 'logger')));
// const logger = new Logger();

const app = express();
const namedRouter = require("route-label")(app);

app.set("views", [
  join(__dirname, "./app/views"),
  join(__dirname, "./app/modules"),
]);
app.engine("ejs", engine);
app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*****************************************************/
/********* Functions + variable declaration *********/
/***************************************************/

const isProd = config.app.isProd;
const getPort = config.app.port;
const getApiFolderName = config.app.getApiFolderName;
const getAdminFolderName = config.app.getAdminFolderName;
app.locals.moment = require("moment");
// Inclide main view path for (admin) //
app.locals.layout_directory = "../../../views/layouts";
app.locals.partial_directory = "../../../views/partials";
global.generateUrl = generateUrl = (route_name, route_param = {}) =>
  namedRouter.urlFor(route_name, route_param);
global.generateUrlWithQuery = generateUrlWithQuery = (
  route_name,
  route_param = {},
  route_query = {}
) => namedRouter.urlFor(route_name, route_param, route_query);

/******************** Middleware registrations *******************/
app.use(cors());

// app.use(express.static('./public'));
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, max-age=3600");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});



/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  const port = getPort;
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(0);
      break;
    default:
      throw error;
  }
};


const server = http.createServer(app);

(async () => {
  try {
    // Database connection//
    await require(resolve(join(__dirname, "app/config", "database")))();
    await require(resolve(join(__dirname, "app/helper", "agenda")))();

    /*********************** Routes Admin **********************/
    const adminApiFiles = await utils._readdir(
      `./app/routes/${getAdminFolderName}`
    );
    adminApiFiles.forEach((file) => {
      if (!file && file[0] == ".") return;
      namedRouter.use("", require(join(__dirname, file)));
      // namedRouter.use('', `/${getAdminFolderName}`, require(join(__dirname, file)));
    });

    namedRouter.buildRouteTable();
    if (!isProd && process.env.SHOW_NAMED_ROUTES === "true") {
      routeList = namedRouter.getRouteTable();
      //console.log(routeList);
    }
    // const server = http.createServer(app);
    server.listen(getPort);
    server.on("error", onError);
    console.log(
      `Project is running on ${
        global.BASE_URL && global.BASE_URL !== ""
          ? global.BASE_URL
          : `http://${process.env.HOST}:${getPort}`
      }`
    );
  } catch (error) {
    console.error(error);
  }
})();

module.exports = app;
