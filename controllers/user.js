import { check, validationResult } from "express-validator";
import { User } from "../models/User.js";

/**
 * Create a new local account.
 * @route POST /signup
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

    console.log('start searching');
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            res.send("Account with that email address already exists.");
        }
        user.save((err) => {
            if (err) { return next(err); }
            // req.logIn(user, (err) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.send("sign up successfully");
            // });
            res.send("sign up success, delete this after uncomment above");
        });
    })

}