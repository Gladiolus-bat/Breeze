import express from "express";
import protect, {restrictTo} from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {createRoom, getRooms, getOwnerRooms, updateRoom, toggleRoomAvailability} from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", protect, restrictTo("admin"), upload.array("images", 4), createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, restrictTo("admin"), getOwnerRooms);
roomRouter.put("/:roomId", protect, restrictTo("admin"), upload.array("images", 4), updateRoom);
roomRouter.post("/toggle-availability", protect, restrictTo("admin"), toggleRoomAvailability);

export default roomRouter;