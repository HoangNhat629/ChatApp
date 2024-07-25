const User = require("../models/AuthModel");
const { generateToken } = require("../config/jwtToken");
const { renameSync, unlinkSync } = require("fs");
const bcrypt = require("bcrypt");
const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send("Email is required");
    }
    if (!password) {
      return res.status(400).send("Password is required");
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ msg: "The email already exists." });
    }

    const newUser = await User.create({
      email,
      password,
      profileSetup: false,
    });

    const token = generateToken({ id: newUser._id });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      msg: "User created successfully",
      user: {
        email: newUser?.email,
        profileSetup: newUser?.profileSetup,
        _id: newUser?._id,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required");
    }

    const user = await User.findOne({ email });
    if (user && (await user.isPasswordMatched(password))) {
      const token = await generateToken({ id: user._id });
      const updateuser = await User.findByIdAndUpdate(
        user.id,
        {
          refreshToken: token,
        },
        { new: true }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.json({
        user: {
          email: updateuser?.email,
          profileSetup: updateuser?.profileSetup,
          firstName: updateuser?.firstName,
          lastName: updateuser?.lastName,
          color: updateuser?.color,
          image: updateuser?.image,
          _id: updateuser?._id,
        },
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id);
    if (!userData) {
      return res.status(404).send("User with the give id not found");
    }
    return res.status(200).json({
      user: {
        email: userData?.email,
        profileSetup: userData?.profileSetup,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        color: userData?.color,
        image: userData?.image,
        _id: userData?._id,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const updateUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName || !color) {
      return res
        .status(400)
        .send("First Name, Last Name and Color are required");
    }
    const userData = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      user: {
        id: userData?.id,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        color: userData?.color,
        profileSetup: userData?.profileSetup,
        email: userData?.email,
        image: userData?.image,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }
    const date = Date.now();
    let fileName = "upload/profile/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);
    const userData = await User.findByIdAndUpdate(
      req.user._id,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: userData?.image,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const deleteProfileImage = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  if (user.image) {
    unlinkSync(user.image);
  }
  user.image = null;
  await user.save();
  return res.status(200).send("Profile image removed successfully");
};
const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 1,
      sameSite: "None",
      secure: true,
    });
    return res.status(200).send("Logged out successfully");
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
module.exports = {
  signUp,
  login,
  getUserInfo,
  updateUserInfo,
  uploadProfileImage,
  deleteProfileImage,
  logOut,
};
