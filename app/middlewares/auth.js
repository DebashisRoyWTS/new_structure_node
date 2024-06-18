const passport = require("passport");
const passportJWT = require("passport-jwt");
const users = require('user/model/user.model');
const config = require('../config/index');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: config.auth.jwtSecret,
  jwtFromRequest: ExtractJwt.fromHeader('token'),
};

const RequestHandler = require('../helper/RequestHandler');
const Logger = require('../helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);

module.exports = () => {
  const strategy = new Strategy(params, (payload, done) => {
    console.log(params);
    users.findById(payload.id)
      .populate({
        path: 'role',
        select: 'role title',
      })
      .exec((err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
  });

  passport.use(strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/');
        }
        req.user = user;
        return next();
      })(req, res, next);
    },
    // This is for webservice jwt token check //
    authenticateAPI: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
          return requestHandler.throwError(400, 'bad request')({ token_expire: true, auth: false, message: 'Please provide a valid token, your token might be expired' });
        }
        if (!user) {
          return requestHandler.sendError(req, res, { status: 400, token_expire: true, auth: false, message: 'Sorry user not found!' });
        }
        req.user = user;
        return next();
      })(req, res, next);
    },
  };
};
