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
