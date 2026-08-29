import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

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

        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) {
            return res.status(404).json({ success: false, message: "No hotel found for this account. Register a hotel first." });
        }

        const images = await Promise.all(req.files.map((file) => uploadToCloudinary(file.buffer, "breeze/rooms")));

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

        const rooms = await Room.find({hotel: hotel._id}).populate("hotel").sort({createdAt: -1});

        res.json({success: true, rooms});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
};

// PUT /api/rooms/:roomId (admin only, must own the room's hotel)
export const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { roomType, pricePerNight, services } = req.body;

        const room = await Room.findById(roomId).populate("hotel");
        if (!room) {
            return res.status(404).json({success: false, message: "Room not found."});
        }

        if (room.hotel.owner !== req.user._id) {
            return res.status(403).json({success: false, message: "You do not own this room."});
        }

        if (roomType) room.roomType = roomType;
        if (pricePerNight) room.pricePerNight = Number(pricePerNight);
        if (services !== undefined) {
            room.services = Array.isArray(services)
                ? services
                : typeof services === "string"
                    ? services.split(",").map((a) => a.trim()).filter(Boolean)
                    : room.services;
        }

        // Only replace images if new ones were uploaded — otherwise keep the existing ones
        if (req.files && req.files.length > 0) {
            room.images = await Promise.all(req.files.map((file) => uploadToCloudinary(file.buffer, "breeze/rooms")));
        }

        await room.save();

        res.json({success: true, message: "Room updated", room});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};
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