const express = require("express");
const admin_route = express();
const adminController = require("../contorllers/adminController");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("../config/config");
const { checkAdmin } = require("../middleware/auth");

// Middleware
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));
admin_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// View Engine
admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

// Admin Routes
admin_route.get("/", adminController.loadAdminLogin);
admin_route.post("/", adminController.verifyAdminLogin);
admin_route.get("/dashboard", checkAdmin, adminController.loadDashboard);
admin_route.get("/logout", checkAdmin, adminController.adminLogout);
admin_route.delete("/users/:id", checkAdmin, adminController.deleteUser);
admin_route.post("/users", checkAdmin, adminController.addUser);
admin_route.put("/users/:id", checkAdmin, adminController.updateUser);
module.exports = admin_route;
