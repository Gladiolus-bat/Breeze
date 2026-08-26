import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// if non-cancelled booking oerlaps the requested data range than true
const isRoomAvailable = async (roomId, checkInDate, checkOutDate, excludeBookingId = null) => {
    const query = {
        room: roomId,
        status: {$ne: "cancelled"},
        checkInDate: {$lt: checkOutDate},
        checkOutDate: {$gt: checkInDate},
    };
    if (excludeBookingId) query._id = {$ne: excludeBookingId};

    const overlapping = await Booking.find(query);
    return overlapping.length === 0;
};

// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const {roomId, checkInDate, checkOutDate} = req.body;

        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({success: false, message: "Room ID, check in date and check out date are required."});
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            return res.status(400).json({success: false, message: "Check out date must be after check in date"});
        }

        const isAvailable = await isRoomAvailable(roomId, checkIn, checkOut);
        res.json({success: true, isAvailable});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

// POST /api/bookings/book (logged in user)
export const createBooking = async (req, res) => {
    try {
        const {roomId, checkInDate, checkOutDate, guests} = req.body;

        if (!roomId || !checkInDate || !checkOutDate || !guests) {
            return res.status(400).json({success: false, message: "Room ID, check in date, check out date and guests are required."});
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            return res.status(400).json({success: false, message: "Check out date must be after check in date."});
        }

        const room = await Room.findById(roomId);

        if (!room || !room.isAvailable) {
            return res.status(400).json({success: false, message: "Room not found or unavailable."});
        }

        const available = await isRoomAvailable(roomId, checkIn, checkOut);
        if (!available) {
            return res.status(400).json({success: false, message: "Room is already booked for those dates."});
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * room.pricePerNight;

        const booking = await Booking.create ({
            user: req.user._id, room: room._id, hotel: room.hotel, checkInDate: checkIn, checkOutDate: checkOut, guests, totalPrice,
        });

        res.status(201).json({success: true, message: "Booking created", booking});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

// GET /api/bookings/user (booking made by logged-in user)
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({user: req.user._id}).populate("room").populate("hotel").sort({createdAt: -1});

        res.json({success: true, bookings});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

// GET /api/bookings/hotel (admin only, booking for owner's hotel)
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({owner: req.user._id});
        if (!hotel) {
            return res.status(404).json({success: false, message: "No hotel found for this account."});
        }

        const bookings = await Booking.find({hotel: hotel._id}).populate("room").populate("user", "username email image").sort({createdAt: -1});

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

        res.json({success: true, dashboardData: {bookings, totalBookings, totalRevenue}});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};