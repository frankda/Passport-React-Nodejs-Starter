import { ExtractJwt, JwtStrategy } from "passport-jwt";
// const User = mongoose.model("users");


import { User } from "../models/User";

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
  res.send("Cannot login");
}