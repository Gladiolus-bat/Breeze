import express from "express";
import protect from "../middleware/authMiddleware.js";
import createUser from "../controllers/createUser.js";
import loginUser from "../controllers/loginUser.js";
import {
  getUserData,
  storeRecentSearchedCities,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", createUser);
userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);

export default userRouter;
