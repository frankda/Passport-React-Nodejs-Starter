const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const passport = require("passport");
//const { mongoURI } = require("./config/keys");

const app = express();

app.set("environment", process.env.NODE_ENV || "production");
app.set("port", process.env.PORT || 5000);

// const api = require("./routes/api");
// const users = require('./routes/api/users');

mongoose.connect('mongodb+srv://Frank:fugh0joor2triy!GEWN@cluster0.jtj0j.mongodb.net/passport-template?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('Mongoose is connected')
}).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

//require("./config/passport")(passport);

// app.use("/api", api);
// app.use('/api/users', users);

if (app.get("environment") === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
  });
}

app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("environment")
    );
    console.log("  Press CTRL-C to stop\n");
});
