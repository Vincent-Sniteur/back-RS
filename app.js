// Requierements
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
// Import DotEnv
require("dotenv").config({ path: "./config/.env" });

const { checkUser, requireAuth } = require("./middleware/auth.middleware");

// DATABASE
mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Declare APP
const app = express();

// Corps
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// JsonWebToken
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// Middleware
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Export APP
module.exports = app;

// TODO : Utilitys functions for the text error messages in the frontend & ObjectId
