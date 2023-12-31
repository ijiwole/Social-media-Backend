import express from "express";
import { getAllUsers, login, signup } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers)
userRouter.post("/signup", signup)
userRouter.post("/login",login)

export default userRouter;