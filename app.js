const express = require("express");
const app = express();
const userRoute = require("./routes/userRoutes"); //requiring the user_routes
const adminRoute = require("./routes/adminRoute"); // Admin routes
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI;

// mongoose
mongoose
  .connect(URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//DataBase

//Create a MongoClient with a MongoClientOptions object to set the Stable API version

// const client = new MongoClient(URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

//user routes
app.use("/", userRoute);
//admin routes
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port http://localhost:3000`);
});
