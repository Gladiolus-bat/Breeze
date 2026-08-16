import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import cloudinary from "../configs/cloudinary.js";

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "breeze/rooms"},
            (error, result) => {
                if(error) return reject(error);
                reslove(result.secure_url);
            },
        );
        stream.end(fileBuffer);
    });
};

// POST /api/rooms (only admin access)
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, services } = req.body;

        if (!roomType || !pricePerNight) {
            return res.status(400).json({success: false, message: "Room type and price per night are required."});
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one room image is required."});
        }

        const images = await Promise.all(req.files.map((file) => uploadToCloudinary(file.buffer)));

        // services can be entered as an array
        const parsedServices = Array.isArray(services) ? services: typeof services === "string" ? services.split(",").map((a) => a.trim()).filter(Boolean): [];

        const room = await Room.create ({
            hotel: hotel._id,
            roomType,
            pricePerNight: Number(pricePerNight),
            services: parsedServices,
            images,
        });

        res.status(201).json({success: true, message: "Room created ", room});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

