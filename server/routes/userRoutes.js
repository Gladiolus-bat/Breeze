import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import createUser from "../controllers/createUser.js";
import loginUser from "../controllers/loginUser.js";
import {
  getUserData,
  storeRecentSearchedCities,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", createUser);
userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);
userRouter.put("/profile", protect, upload.single("image"), updateProfile);
userRouter.put("/change-password", protect, changePassword);

export default userRouter;
