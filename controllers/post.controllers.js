const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId; // TODO: Read Post By Id

// Read All Post
module.exports.readPost = async (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("Error to get data : " + err);
    }
  }).sort({ createdAt: -1 });
};

// Create Post
module.exports.createPost = async (req, res) => {
  if (req.file !== null) {
    console.log("pas d'image connard");
  }

  console.log(req.body);

  const newPost = new postModel({
    userId: req.body.userId,
    message: req.body.message,
    picture: req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : null,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ err });
  }
};

// Update Post
module.exports.updatePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Post
module.exports.deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("The post has been deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Like & Dislike Post
module.exports.likePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post.likers.includes(req.body.userId)) {
      await post.updateOne({ $push: { likers: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likers: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Create Comment Post
module.exports.createCommentPost = async (req, res) => {
  try {
    return PostModel.findById(req.params.id, (err, post) => {
      if (err) {
        return res.status(500).json({ err });
      } else if (post) {
        UserModel.findById(req.body.commenterId, (err, user) => {
          if (err) {
            return res.status(500).json({ err });
          } else if (user) {
            post.comments.push({
              commenterId: req.body.commenterId,
              commenterPseudo: user.pseudo,
              text: req.body.text,
              timestamp: Date.now(),
            });
            post.save((err) => {
              if (err) {
                return res.status(500).json({ err });
              } else {
                return res.status(201).json(post);
              }
            });
          }
        });
      }
    });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

// Update Comment Post
module.exports.updateCommentPost = async (req, res) => {
  try {
    return PostModel.findById(req.params.id, (err, post) => {
      const comment = post.comments.find(
        (comment) => comment._id == req.params.commentId
      );
      if (comment.commenterId == req.body.commenterId) {
        comment.text = req.body.text;
        post.save((err) => {
          if (err) {
            return res.status(500).json({ err });
          } else {
            return res.status(201).json(post);
          }
        });
      } else {
        return res.status(403).json("You can update only your comment");
      }
    });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

// Delete Comment Post
module.exports.deleteCommentPost = async (req, res) => {
  try {
    return PostModel.findById(req.params.id, (err, post) => {
      const comment = post.comments.find(
        (comment) => comment._id == req.params.commentId
      );
      if (comment.commenterId == req.body.commenterId) {
        comment.remove();
        post.save((err) => {
          if (err) {
            return res.status(500).json({ err });
          } else {
            return res.status(201).json(post);
          }
        });
      } else {
        return res.status(403).json("You can delete only your comment");
      }
    });
  } catch (err) {
    return res.status(400).json({ err });
  }
};
