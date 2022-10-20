const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    posterId: { type: String, required: true },
    message: { type: String, required: true, maxlength: 500, trim: true },
    picture: { type: String },
    video: { type: String },
    likers: { type: Array, default: [], required: true },
    comments: {
      type: [
        {
          commenterId: { type: String },
          commenterPseudo: { type: String },
          text: { type: String },
          timestamp: { type: Number },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", PostSchema);
