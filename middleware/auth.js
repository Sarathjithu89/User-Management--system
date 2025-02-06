const isLogin = async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      return res.redirect("/");
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return res.redirect("/home");
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const checkAdmin = (req, res, next) => {
  if (req.session.admin_id) {
    next();
  } else {
    res.redirect("/admin");
  }
};

module.exports = { isLogin, isLogout, checkAdmin };
