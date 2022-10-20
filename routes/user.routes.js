const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const userController = require("../controllers/user.controllers");

// Auth
router.post("/register", authController.signUp); // Register
router.post("/login", authController.signIn); // Login
router.get("/logout", authController.logout); // Logout

// User
router.get("/", userController.getAllUsers); // Get all users
router.get("/:id", userController.userInfo); // Get user info
router.put("/:id", userController.updateUser); // Update user
router.delete("/:id", userController.deleteUser); // Delete user
router.patch("/follow/:id", userController.follow); // Follow user
router.patch("/unfollow/:id", userController.unfollow); // Unfollow user

// Upload // Voir avec Multer
// router.post("/upload", upload.single("file"), userController.uploadProfil); // Upload profil picture

module.exports = router;
