const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // validate: { isEmail }, A faire plus tard pour validé l'email
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
      trim: true,
    },
    username: {
      type: String,
      default: Math.random().toString(36).substring(2, 15), // Add random username
      minlength: 3,
      maxlength: 50,
      unique: true,
      trim: true,
    },
    status: { type: String, enum: ["user", "admin"], default: "user" },
    createAt: { type: Date, default: Date.now },
    bio: { type: String, maxlength: 500, trim: true },
    picture: { type: String, trim: true, default: "" },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    likes: { type: Array, default: [] },
  },
  { timestamps: true }
);

// Play Function before save into DB
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
