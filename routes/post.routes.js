const router = require("express").Router();
const postConstrollers = require("../controllers/post.controllers");

// Post
router.get("/", postConstrollers.readPost); // Read Post
router.post("/", postConstrollers.createPost); // Create Post
router.put("/:id", postConstrollers.updatePost); // Update Post
router.delete("/:id", postConstrollers.deletePost); // Delete Post
router.post("/:id/like", postConstrollers.likePost); // Like & Dislike Post

// Comment Post
router.post("/:id/comment", postConstrollers.createCommentPost); // Create Comment Post
router.put("/:id/comment/:id", postConstrollers.updateCommentPost); // Update Comment Post
router.delete("/:id/comment/:id", postConstrollers.deleteCommentPost); // Delete Comment Post

module.exports = router;
