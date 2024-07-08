const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const Note = require("../models/noteModel.js");

const generateToken = require("../utils/generateToken");

const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Inside this there are MongoDB queries

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user,
      name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Error Occured!");
  }
});

const authUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password!");
  }
});

const updateUserProfile = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Sending information to frontend
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc    Delete user and their notes
// @route   DELETE /api/users/profile
// @access  Private
const deleteUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Delete user's notes
    await Note.deleteMany({ user: req.user._id });

    // Delete user
    await User.deleteOne({ _id: req.user._id });
    res.json({ message: "User and their notes deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { registerUser, authUser, updateUserProfile, deleteUser };
