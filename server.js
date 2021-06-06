import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import "./utils/secrets.js";

// Controllers (route handlers)
import * as userController from "./controllers/user.js";

// Create Express server
const app = express();

// Setup environment
app.set("environment", process.env.NODE_ENV || "production");
app.set("port", process.env.PORT || 5000);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('Mongoose is connected')
}).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

// Express configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

/**
 * Primary app routes.
 */
app.post("/api/signup", userController.postSignup);
app.post("/api/login", userController.postLogin);
app.get("/api/findUser", userController.findUser);

/**
 * Return React to client
 */
if (app.get("environment") === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
  });
}

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("environment")
    );
    console.log("  Press CTRL-C to stop\n");
});
