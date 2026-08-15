import bcrypt from "bcryptjs";
import User from "../models/User.js";

const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      username: username || email.split("@")[0],
    });

    res.status(201).json({
      id: createdUser._id,
      email: createdUser.email,
      username: createdUser.username,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export default createUser;
