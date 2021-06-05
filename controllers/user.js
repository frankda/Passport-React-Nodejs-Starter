import { check, validationResult } from "express-validator";
import passport from "passport";
import { User } from "../models/User.js";
import "../config/passport.js";

/**
 * Sign in using email and password.
 * @route POST /api/login
 */
export const postLogin = async (req, res, next) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).json(errors.array());
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(400).send({ msg: info.message });
        }
        return res.status(200).json(user);
    })(req, res, next);
}

/**
 * Create a new local account.
 * @route POST /api/signup
 */

export const postSignup = async (req, res, next) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
        
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            return res.send("Account with that email address already exists.");
        }
        console.log('saving!');
        user.save((err, user) => {
            if (err) { return next(err); }
            res.json(user);
        })
    })
}