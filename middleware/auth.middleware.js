const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// Check User
module.exports.checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else (res.locals.user = null), next();
};

// Require Auth
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
