import { apiRequest } from "./client";

export const registerHotel = ({ name, address, contact, city }, token) =>
  apiRequest("/hotels", {
    method: "POST",
    body: JSON.stringify({ name, address, contact, city }),
    token,
  });
