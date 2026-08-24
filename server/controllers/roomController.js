import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import cloudinary from "../configs/cloudinary.js";

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "breeze/rooms"},
            (error, result) => {
                if(error) return reject(error);
                resolve(result.secure_url);
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

// GET /api/rooms (shows available room)
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate ({
            path: "hotel",
            populate: {path: "owner", select: "username image"},
        }).sort({createdAt: -1});

        res.json({success: true, rooms});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

// GET /api/rooms/owner (Admin only for their own hotel)
export const getOwnerRooms = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({owner: req.user._id});
        if (!hotel) {
            return res.status(404).json({success: false, message: "No hotel found for this account"});
        }

        const rooms = (await Room.find({hotel: hotel._id}).populate("hotel")).toSorted({createdAt: -1});

        res.json({success: true, rooms});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
};

// POST /api/rooms/toggle-availability (admin only)
export const toggleRoomAvailability = async (req, res) => {
    try {
        const {roomId} = req.body;
        if (!roomId) {
            return res.status(400).json({success: false, message: "Room Id required."});
        }

        const room = await Room.findById(roomId).populate("hotel");
        if (!room) {
            return res.status(404).json({success: false, message: "Room not found."});
        }

        if (room.hotel.owner !== req.user._id) {
            return res.status(403).json({success: false, message: "You do not own this room."});
        }

        room.isAvailable = !room.isAvailable;
        await room.save();

        res.json({success: true, message: "Room availability updated ", room});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};