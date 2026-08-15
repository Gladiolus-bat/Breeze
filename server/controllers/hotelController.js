import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;

    if (!name || !address || !contact || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingHotel = await Hotel.findOne({owner: req.user._id});
    if (existingHotel) {
      return res.status(400).json({ success: false, message: "You have already registered a hotel" });
    }

    const hotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      owner: req.user._id,
    });

    req.user.role = "admin";
    await req.user.save();

    res.status(201).json({ message: "Hotel registered successfully", hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
