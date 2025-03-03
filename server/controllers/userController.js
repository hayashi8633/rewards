// Import the users object
// import db from "../models/models.js"
import { pool } from "../models/models.js";
import { supabase } from "../server.js";

const userController = {};

// TODO NOTE FOR RACHEL: REMEMBER THE REQ.HEADERS THING (put in handleClick header "loggedUser": "username" and you can have access to it and pass it as a param to the backend)

// This middleware will be used to login the user (could be customer or business)
userController.loginUser = (req, res, next) => {
  console.log("Customer login middleware reached");
  const data = [req.body.phone, req.body.password];
  const existingCust =
    "SELECT name FROM accounts WHERE phone=$1 AND password=$2";
  // automatically assumes the login wll not work
  res.locals.loginSuccessful = false;
  try {
    //logic for customer login attempts

    // check if phone # exists first
    pool.query(existingCust, data, (error, results) => {
      console.log("results", results.rows);
      // ^ this prints [ { name: 'rachel' } ]

      if (results.rowCount === 1) {
        // user is now logged in
        res.locals.loginSuccessful = true;
        // user's name is saved (for the "welcome, [user] message")
        res.locals.user = results.rows[0];
        return next();
      } else if (results.rowCount === 0) {
        return next({
          log: "log: No user found",
          message: "Message: No user found",
        });
      }
    });
    // check whether they're a business or customer (userType column in the database)
    // check if the password matches the phone # given
  } catch (err) {
    // error handling
    return next({
      log: "log: Error getting users",
      message: "Message: Error getting users",
    });
  }
};

userController.register = async (req, res, next) => {
  // get the name (of the business/customer), phone #, and password from the frontend
  // put "customer" in database if the user didn't click "yes" to the "are you a business?" question
  // put "business" in database if they did
  const { name, phoneNum, password, userType } = req.body;
  try {
    //logic for registration attempts
    // check if the phone # already exists
    // const text = `SELECT EXISTS (SELECT 1 FROM accounts WHERE phone = $1) AS exists;`;
    // ^ was here before
    const { user_type, phone, name } = req.body;

    // user_type should pass 'customer' into the database if the "are you a business?" box is not checked- if it is, it should pass 'business' so that the SQL database can be updated accordingly
    const text = `INSERT INTO accounts (user_type, phone, name) values ($1, $2, $3)`;
    // return { "exists": true } if exists
    const result = await pool.query(text, [user_type, phone, name]);
    res.locals.newUser = result;
    return next();
    // if (result.rows[0].exists)
    // if it does, return an error (or yell at the person registering and call em a dummy)
    // if it doesn't, log them in! and add a new row in business_name Table
    // MINI STRETCH GOAL: if the phone # already exists, instead of throwing an error and breaking code, the frontend could shake and the input fields could turn red and a little message could show up at the bottom of the screen saying "this phone # is already taken!"
  } catch (err) {
    // error handling
    return next({
      log: "log: Error registering user",
      message: "Message: Error registering user",
    });
  }
};

// THIS IS THE ONLY MIDDLEWARE THAT IS *ONLY* FOR CUSTOMERS
userController.getDash = (req, res, next) => {
  try {
    //logic for customer dashboard getting(?)
    const data = [];
    const custDash = `SELECT b.business_name, b.num_of_visits 
        FROM business_info b 
            JOIN accounts a ON b.phone = a.phone 
            WHERE a.phone = ?;`;
    // get names of all the businesses they're a rewards member at, the number of times they've visited each business, and the customer's name
    // display it (aka feed it to the front end):D
  } catch (err) {
    // error handling
    return next({
      log: "log: Error getting customer dashboard",
      message: "Message: Error getting customer dashboard",
    });
  }
};

export { userController };
