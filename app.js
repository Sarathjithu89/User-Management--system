const express = require("express");
const app = express();
const userRoute = require("./routes/userRoutes"); //requiring the user_routes
const adminRoute = require("./routes/adminRoute"); // Admin routes
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
mongoose
  .connect("mongodb://127.0.0.1:27017/User_mangement", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//user routes
app.use("/", userRoute);
//admin routes
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port http://localhost:3000`);
});
