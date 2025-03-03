//   <<Imports>>
import express from "express";
import { userController } from "../controllers/userController.js";

// Create a new router
const userRouter = express.Router();

// User Login
userRouter.post("/login", userController.loginUser, userController.setCookie, (req, res) => {
    console.log("🐣 User Login Processed.");
    return res.status(200).json(res.locals.user);
});

// User Registration
userRouter.post("/register", userController.register, userController.setCookie, (req, res) => {
    console.log("REGISTER ROUTER REACHED");
    return res.status(200).json(res.locals.user);
});

// Client Dashboard
userRouter.get("/dashboard", userController.isLoggedIn, userController.getDash, (req, res) => {
    return res.status(200).json({});
});

export { userRouter };