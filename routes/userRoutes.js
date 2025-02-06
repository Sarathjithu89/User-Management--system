//require
const express = require("express");
const user_route = express();
const userController = require("../contorllers/userController");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("../config/config");
const auth = require("../middleware/auth");
const nocache = require("nocache");

//middlewares
user_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
user_route.use(express.static("./public"));
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(nocache());
user_route.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//view engin,public files
user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

//user routes
user_route.get("/register", auth.isLogout, userController.loadRegister);
user_route.post("/register", userController.insertUser);
user_route.get("/", auth.isLogout, userController.loadLogin);
user_route.post("/", userController.verifyLogin);
user_route.get("/home", userController.loadHome);
user_route.get("/logout", auth.isLogin, userController.userLogout);

module.exports = user_route; //exporting the user_route
