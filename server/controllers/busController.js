// Import the users object
// import db from "../models/models.js"
import { pool } from "../models/models.js";
import { supabase } from "../server.js"

const busController = {};

busController.addCustomer = (req, res, next) => {
    try {
        //logic for adding a customer to the rewards program
    } catch (err) {
        // error handling
    }
}

busController.addStar = (req, res, next) => {
    try {
        //logic for customer dashboard getting(?)
    } catch (err) {
        // error handling
    }
}

// This middleware will be used to login the customer
busController.getDash = (req, res, next) => {
    console.log("Business DASHBOARD middleware reached");
    try {
        //logic for business dashboard
    } catch (err) {
        // error handling
    }
}


export { busController };