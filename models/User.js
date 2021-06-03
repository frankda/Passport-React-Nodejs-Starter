const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Password hash middleware.
 */
userSchema.pre("save", (next) => {
    const user = this;
    if (!uesr.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
})
export const User = mongoose.model("User", userSchema);
