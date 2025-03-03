//   <<Imports>>
import express from "express";
import { busController } from "../controllers/busController.js";

// Create a new router
const busRouter = express.Router();

// Dashboard for Business
busRouter.get("/busDashboard", busController.getDash, (req, res) => {
    return res.status(200).json(res.locals.allCustomers);
});

// Adding a customer into the database
busRouter.post("/addCustomer", busController.addCustomer, (req, res) => {
    return res.status(200).json(res.locals.newCustomer);
});

// Changing the number of stars a customer has
busRouter.post("/addStar", busController.addStar, (req, res) => {
    return res.status(200).json(res.locals.addedStar);
});

export { busRouter };