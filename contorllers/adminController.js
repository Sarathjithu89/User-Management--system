const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

//hashing password function
const hashpassword = async (password) => {
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    return hashedPass;
  } catch (error) {
    console.log(error.message);
  }
};

// Load Admin Login Page
const loadAdminLogin = async (req, res) => {
  try {
    if (!req.session.admin_id) {
      res.render("adminLogin", { error: null });
    } else {
      return res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Verify Admin Login
const verifyAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, is_admin: 1 }); // Only check for admin users

    if (admin && (await bcrypt.compare(password, admin.password))) {
      req.session.admin_id = admin._id;
      res.redirect("/admin/dashboard");
    } else {
      res.render("adminLogin", { error: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error.message);
    res.render("adminLogin", { error: "Server error" });
  }
};

// Admin Dashboard
const loadDashboard = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.render("dashboard", { users }); // Pass users to EJS
  } catch (error) {
    console.log(error.message);
    res.render("dashboard", { users: [] }); // Fallback to empty array
  }
};

// Admin Logout
const adminLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Logout failed");
      }
      res.clearCookie("connect.sid"); // Clear session cookie
      res.redirect("/admin"); // Redirect to login page
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/admin");
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Changed from email to id
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      is_admin: 0,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  // try {
  //   const userId = req.params.id;
  //   const { name, email, mobile } = req.body;

  //   await User.findByIdAndUpdate(userId, { name, email, mobile });
  //   res.status(200).json({ message: "User updated successfully" });
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).json({ message: "Server error" });
  // }

  try {
    const userId = req.params.id;
    const { name, email, mobile, password } = req.body;

    const updateData = { name, email, mobile, password };
    if (password) updateData.password = await hashpassword(password);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  loadAdminLogin,
  verifyAdminLogin,
  loadDashboard,
  deleteUser,
  adminLogout,
  addUser,
  updateUser,
};
