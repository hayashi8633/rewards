// Import the users object
// import db from "../models/models.js"
import { pool } from '../models/models.js';
import { supabase } from '../server.js';

const busController = {};

busController.addCustomer = (req, res, next) => {
  try {
    //logic for adding a customer to the rewards program
    // check if phone # exists first
    // if exists, error message
    // not exists, add the information of the customer to database
    // phone number, name, number of visits
  } catch (err) {
    // error handling
  }
};

// number of visits increase
busController.addStar = (req, res, next) => {
  try {
    // serach the phone# in database
    // if exists add number of visits
    // if not, add Customer
  } catch (err) {
    // error handling
  }
};

// This middleware will be used to login the customer
busController.getDash = (req, res, next) => {
  console.log('Business DASHBOARD middleware reached');
  try {
    //logic for business dashboard getting(?)
    // get names of all rewards members, the number of times they've visited, customer's phone number and the customer's name
    // display it (aka feed it to the front end):D
  } catch (err) {
    // error handling
  }
};

export { busController };
