import passport from "passport";
import passportLocal from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import { User } from "../models/User.js";

const LocalStrategy = passportLocal.Strategy;

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase()}, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: "Invalid email or password." });
    });
  });
}));

/**
 * Sign in with JWT.
 */
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findOne({id: jwt_payload.sub}, (err, user) => {
      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
          // or you could create a new account
      }
  });
}));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req, res, next) => {
  // isAuthenticated is the passport custom implementation
  // https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74
  if (req.isAuthenticated()) {
    return next();
  }
 return res.send("Cannot login");
}