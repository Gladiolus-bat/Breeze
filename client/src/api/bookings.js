import { apiRequest } from "./client";

export const checkAvailability = ({ roomId, checkInDate, checkOutDate }) =>
  apiRequest("/bookings/check-availability", {
    method: "POST",
    body: JSON.stringify({ roomId, checkInDate, checkOutDate }),
  });

export const createBooking = (
  { roomId, checkInDate, checkOutDate, guests },
  token,
) =>
  apiRequest("/bookings/book", {
    method: "POST",
    body: JSON.stringify({ roomId, checkInDate, checkOutDate, guests }),
    token,
  });

export const getUserBookings = (token) =>
  apiRequest("/bookings/user", { token });

// Admin only — bookings + revenue for the caller's hotel
export const getHotelBookings = (token) =>
  apiRequest("/bookings/hotel", { token });
