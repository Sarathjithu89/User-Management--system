require("dotenv").config();

const sessionSecret = process.env.SESSION;

module.exports = {
  sessionSecret,
};
