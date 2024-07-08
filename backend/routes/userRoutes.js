const express = require("express");
const {
  registerUser,
  authUser,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userControllers");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

// Route is basically an API end point
router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/profile").post(protect, updateUserProfile);
router.route("/profile").delete(protect, deleteUser);

module.exports = router;
