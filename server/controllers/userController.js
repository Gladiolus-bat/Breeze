import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// GET /api/user/
export const getUserData = async (req, res) => {
  try {
    const { _id, username, email, image, role, recentSearchedCities } =
      req.user;
    res.json({
      success: true,
      user: { id: _id, username, email, image, role, recentSearchedCities },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/user/profile (username and/or profile picture)
export const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const user = req.user;

    if (username) user.username = username;

    if (req.file) {
      user.image = await uploadToCloudinary(req.file.buffer, "breeze/users");
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        recentSearchedCities: user.recentSearchedCities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/user/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters long." });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isMatched) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password updated." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Store User Recent Searched Cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = req.user;

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.json({ success: true, message: "City added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
