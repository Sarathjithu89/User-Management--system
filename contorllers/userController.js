const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

//password hashing
const hashpassword = async (password) => {
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    return hashedPass;
  } catch (error) {
    console.log(error.message);
  }
};

//user registrations
const loadRegister = async (req, res) => {
  try {
    const message = req.query.message;
    res.render("registration", { message });
  } catch (err) {
    console.log(err.message);
  }
};

//new user creation
const insertUser = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    //to check if already existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect("/register?message=Already existing User");
    }

    const password = await hashpassword(req.body.password);
    const user = new User({
      name: name,
      email: email,
      mobile: mobile,
      password: password,
      is_admin: 0,
    });

    const userData = await user.save();
    if (userData) {
      res.redirect("/?message1=Your registration is sucessfull");
    } else {
      res.redirect("/register?message=Your registration has been failed");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//user login
const loadLogin = async (req, res) => {
  try {
    if (!req.session.user_id && !req.session.admin_id) {
      const message = req.query.message;
      const message1 = req.query.message1;
      console.log(message);
      return res.render("login", { message, message1 });
    } else if (req.session.admin_id) {
      return res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//user verification
const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_verified === 0) {
          res.redirect("/?message=please verify");
        }
        req.session.user_id = userData._id;
        if (req.session.user_id) {
          res.redirect("/home");
        } else {
          req.session.user_id = false;
          return res.redirect("/");
        }
      } else {
        res.redirect("/?message=Please Enter a valid password");
      }
    } else {
      res.redirect("/?message=Not Registered user,please register");
    }
  } catch (error) {
    console.log(error.message);
    res.render("login", { message: "server error" });
  }
};

//load home page
const loadHome = async (req, res) => {
  try {
    if (req.session.user_id) {
      const currentUser = await User.findById({ _id: req.session.user_id });

      return res.render("home", { user: currentUser });
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//logout route
const userLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.clearCookie("connect.sid");
        console.log(err.message);
        return res.redirect("/home");
      }
      return res.redirect("/");
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

module.exports = {
  loadRegister,
  insertUser,
  loadLogin,
  verifyLogin,
  loadHome,
  userLogout,
};
