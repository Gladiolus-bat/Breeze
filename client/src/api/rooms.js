import { apiRequest } from "./client";

// Public — only rooms with isAvailable: true
export const getRooms = () => apiRequest("/rooms");

// Admin only — all rooms belonging to the caller's hotel
export const getOwnerRooms = (token) => apiRequest("/rooms/owner", { token });

// Admin only — formData must include roomType, pricePerNight, services, and 1-4 images
export const createRoom = (formData, token) =>
  apiRequest("/rooms", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });

export const toggleRoomAvailability = (roomId, token) =>
  apiRequest("/rooms/toggle-availability", {
    method: "POST",
    body: JSON.stringify({ roomId }),
    token,
  });

// Admin only — formData may include roomType, pricePerNight, services, and/or new images
export const updateRoom = (roomId, formData, token) =>
  apiRequest(`/rooms/${roomId}`, {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
