import express from "express";
import protect, {restrictTo} from "../middleware/authMiddleware.js";
import { checkAvailabilityAPI } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);

export default bookingRouter;