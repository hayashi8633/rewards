//   <<Imports>>
import express from "express";
import { userController } from "../controllers/userController.js";

// Create a new router
const userRouter = express.Router();

// User Login
userRouter.post("/login", userController.loginUser, (req, res) => {
    console.log("🐣 User Login Processed.");
    return res.status(200).json(res.locals.user);
});

// User Registration
userRouter.post("/register", userController.register, (req, res) => {
    console.log("REGISTER ROUTER REACHED");
    return res.status(200).json(res.locals.newUser);
});

// Client Dashboard
userRouter.get("/dashboard", userController.getDash, (req, res) => {
    console.log("GETTING TERRITORIESSSSSSSSSSS");
    return res.status(200).json(res.locals.existingTerritories);
});

export { userRouter };