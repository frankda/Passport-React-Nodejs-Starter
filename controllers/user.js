import passport from "passport";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { User } from "../models/User.js";
import "../config/passport.js";

/**
 * Sign in using email and password.
 * @route POST /api/login
 * @req.body {string} email 
 * @req.body {string} password 
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
        jwt.sign({ email: user.email }, process.env.SECRET, {
            expiresIn: 60 * 60,
        }, (err, token) => {
            res.status(200).json({
                auth: true,
                token,
                msg: "User found & logged in"
            });
        }); 
    })(req, res, next);
}

/**
 * Create a new local account.
 * @route POST /api/signup
 * @req.body {string} name
 * @req.body {string} email 
 * @req.body {string} password 
 * @req.body {string} confirmPassword 
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

/**
 * Find logged in user.
 * @route post /api/findUser
 * request header: 
 * Authorization: Bearer <token>
 */

export const findUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (!user) {
            return res.status(401).send({ msg: "invalid token" });
        }
        res.send(user);
    })(req, res, next)
}
