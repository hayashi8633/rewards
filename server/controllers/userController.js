// Import the users object
// import db from "../models/models.js"
import { pool } from '../models/models.js';
import { supabase } from '../server.js';

const userController = {};

// TODO NOTE FOR RACHEL: REMEMBER THE REQ.HEADERS THING (put in handleClick header "loggedUser": "username" and you can have access to it and pass it as a param to the backend)

// This middleware will be used to login the user (could be customer or business)
userController.loginUser = (req, res, next) => {
  console.log('Customer login middleware reached');
  const data = [req.body.phone, req.body.password];
  // res.locals.currentUser = req.body;
  const existingCust =
    'SELECT name, user_type FROM accounts WHERE phone=$1 AND password=$2';
  // automatically assumes the login wll not work
  res.locals.loginSuccessful = false;
  try {
    //logic for customer login attempts

    // check if phone # exists first
    pool.query(existingCust, data, (error, results) => {
      console.log('results', results.rows);
      res.locals.currentUser = {
        username: results.rows[0].name,
        phone: req.body.phone,
      };
      // ^ this prints [ { name: 'rachel' } ]

      if (results.rowCount === 1) {
        // user is now logged in
        res.locals.loginSuccessful = true;
        // user's name is saved (for the "welcome, [user] message")
        res.locals.user = {
          username: results.rows[0].name,
          usertype: results.rows[0].user_type.toLowerCase(),
          phone: req.body.phone,
        };
        return next();
      } else if (results.rowCount === 0) {
        return next({
          log: 'log: No user found',
          message: 'Message: No user found',
        });
      }
    });
  } catch (err) {
    // error handling
    return next({
      log: 'log: Error getting users',
      message: 'Message: Error getting users',
    });
  }
};

// Yihe's version
userController.register = async (req, res, next) => {
  // get the name (of the business/customer), phone #, and password from the frontend
  // put "customer" in database if the user didn't click "yes" to the "are you a business?" question
  // put "business" in database if they did
  const { username, phone, password, usertype } = req.body;
  // res.locals.currentUser = req.body;
  // console.log(req.body.username)
  try {
    //logic for registration attempts
    // check if the phone # already exists
    console.log('TRY BLOCK ENTERED ALKDJFALSKDJF');
    const text = `SELECT EXISTS (SELECT 1 FROM accounts WHERE phone = $1) AS exists;`;
    // return { "exists": true } if exists
    const result = await pool.query(text, [phone]);
    if (result.rows[0].exists) {
      return next({
        log: 'Phone number existed already.',
        status: 400,
        message: { err: 'The phone number is registered.' },
      });
    }
    const text1 = `INSERT INTO accounts (name, phone, password, user_type) VALUES ($1, $2, $3, $4)`;
    const results1 = await pool.query(text1, [
      username,
      phone,
      password,
      usertype,
    ]);
    res.locals.user = {
      username: username,
      usertype: usertype.toLowerCase(),
      phone: phone,
    };
    return next();
    // if it does, return an error (or yell at the person registering and call em a dummy)
    // if it doesn't, log them in! and add a new row in business_name Table
    // MINI STRETCH GOAL: if the phone # already exists, instead of throwing an error and breaking code, the frontend could shake and the input fields could turn red and a little message could show up at the bottom of the screen saying "this phone # is already taken!"
  } catch (err) {
    // error handling
    return next({
      log: 'Internal server error during registering.',
      status: 500,
      message: { err: 'Error in Register.' },
    });
  }
  // after registration should redirect to dashboard
};

// THIS IS THE ONLY MIDDLEWARE THAT IS *ONLY* FOR CUSTOMERS
userController.getDash = async (req, res, next) => {
  try {
    //logic for customer dashboard getting(?)

    const customerName = [req.query.customerName];
    //use req.query.customerName to get phone number
    //then pass that into data
    const phoneQuery = `SELECT phone FROM accounts WHERE name=$1;`;
    const results = await pool.query(phoneQuery, customerName);
    const data = [results.rows[0].phone];

    // const data = [req.cookies.phone];
    // console.log('req.body:', req.body);

    const custDash = `SELECT * FROM (SELECT b.business_name, b.num_of_visits, b.phone, b.customer_name 
        FROM business_info b 
           RIGHT JOIN accounts a ON b.phone = a.phone) AS U WHERE U.phone = $1;`;

    pool.query(custDash, data, (error, results) => {
      res.locals.dashboard = results.rows;
      console.log(res.locals.dashboard);
      return next();
    });

    // get names of all the businesses they're a rewards member at, the number of times they've visited each business, and the customer's name
    // display it (aka feed it to the front end):D
  } catch (err) {
    // error handling
    return next({
      log: 'log: Error getting customer dashboard',
      message: 'Message: Error getting customer dashboard',
    });
  }
};

userController.isLoggedIn = (req, res, next) => {
  const { phone, username } = req.cookies;
  console.log('phone, ', phone);
  console.log('username, ', username);
  const endpoint = req.query.customerName;

  console.log('endpoint: ', endpoint);

  //SQL query to make sure that the ID and username match an ID and username in the database
  const text = 'SELECT * FROM accounts WHERE phone=$1 AND name=$2';
  const values = [phone, username];
  pool.query(text, values).then((response) => {
    // console.log('here is what isLogged in found: ', response);
    if (
      response.rows[0].name === username &&
      response.rows[0].phone === phone &&
      username === endpoint
    ) {
      res.locals.loggedIn = true;
      return next();
    } else {
      console.log('you tried to go to the wrong page!');
      res.locals.loggedIn = false;
      return next();
      // res.redirect('http://localhost:5173/');
      //this does not work!
    }
  });
};

userController.setCookie = (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    res.cookie('phone', currentUser.phone);
    res.cookie('username', currentUser.username);
    // console.log('res.locals.user: ', res.locals.user);
    console.log('cookies set for ', currentUser);
    // console.log('res object: ', res._headers['set-cookie']);
    return next();
  } catch (err) {
    return next(err);
  }
};

export { userController };
