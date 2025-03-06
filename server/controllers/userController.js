// Import the users object
// import db from "../models/models.js"
import { pool } from '../models/models.js';
// import { supabase } from '../server.js';

// import bcrypt
const SALT_WORK_FACTOR = 10;
import bcrypt from 'bcryptjs';

// bcrypt hash function
// bcrypt.hash(myPlaintextPassword, SALT_WORK_FACTOR, function(err, hash) {
//   // Store hash in your password DB.
// });

const userController = {};

// TODO NOTE FOR RACHEL: REMEMBER THE REQ.HEADERS THING (put in handleClick header "loggedUser": "username" and you can have access to it and pass it as a param to the backend)

// Yihe's version
userController.register = async (req, res, next) => {
  // get the name (of the business/customer), phone #, and password from the frontend
  // put "customer" in database if the user didn't click "yes" to the "are you a business?" question
  // put "business" in database if they did
  const { username, phone, password, usertype } = req.body;
  // res.locals.currentUser = req.body;
  // console.log(req.body.username)
  try {
     // hash password
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('HASH PASS', hashedPassword);
    //logic for registration attempts
    // check if the phone # already exists
    console.log('TRY BLOCK ENTERED');
    const text = `SELECT EXISTS (SELECT 1 FROM accounts WHERE phone = $1) AS exists;`;
    // return { "exists": true } if exists
    const result = await pool.query(text, [phone]);
    if (result.rows[0].exists) {
      return next({
        log: 'Phone number existed already.',
        status: 400,
        message: { err: 'The phone number is registered.' },
      });
      // would be good to add something here
      // hopefully htis is enough content.
      // making videos can be a lot sometimes
    }
    const text1 = `INSERT INTO accounts (name, phone, password, user_type) VALUES ($1, $2, $3, $4)`;
    const results1 = await pool.query(text1, [
      username,
      phone,
      hashedPassword,
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

// This middleware will be used to login the user (could be customer or business)
// CURRENTLY DOES NOT WORK FOR NON HASHED PASSWORDS
userController.loginUser = async (req, res, next) => {
  console.log('Customer login middleware reached');
  const { phone, password } = req.body;
  console.log('REQ INFO', phone, password);

  // compare passed in password using bcrypt to determine login success
  //bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
  //     // result == true
  // });
 

  const data = [phone];
  console.log('COMPLETE DATA IS', data)
  // res.locals.currentUser = req.body;
  const existingCust =
    'SELECT name, user_type, password FROM accounts WHERE phone=$1';
  // automatically assumes the login wll not work
  res.locals.loginSuccessful = false;
  try {
    //logic for customer login attempts

    // check if phone # exists first
    pool.query(existingCust, data, async (error, results) => {
      console.log('results', results.rows);
      // console.log('Password', results[0].password)
      const hashedFromDb = results.rows[0].password;
      // console.log("HASHED PW", hashedFromDb);

      const dbMatch = await bcrypt.compare(password, hashedFromDb);
      console.log('DB MATCH', dbMatch);

      //  the below messes things up
      // res.locals.currentUser = {
      //   username: results.rows[0].name,
      //   phone: req.body.phone,
      // };
      // ^ this prints [ { name: 'rachel' } ]
      
      // check that there is such a user and their password matches
      if (results.rowCount === 1 && dbMatch) {
        // user is now logged in
        res.locals.loginSuccessful = true;
        // user's name is saved (for the "welcome, [user] message")
        res.locals.user = {
          username: results.rows[0].name,
          usertype: results.rows[0].user_type.toLowerCase(),
          phone: req.body.phone,
        };
        return next();
      } 
      // if there is no such user or the password doesn't match
      else if (results.rowCount === 0 || !dbMatch) {
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

// THIS IS THE ONLY MIDDLEWARE THAT IS *ONLY* FOR CUSTOMERS
userController.getDash = async (req, res, next) => {
  const { username } = req.cookies;
  console.log('logged in user is, ', username);
  const endpoint = req.query.customerName;
  // backend redirect if user tries to go to another user's page
  if (username !== endpoint) {
    console.log("REDIRECT FROM GET DASH");
    // OPT 1 works for now
    return res.redirect('/');
    //  OPT 2 works most times, but sometimes glitches after a user has just registered
    // res.locals.dashboard = 'nah';
    // return next();
    // OPT 3 causes big problems with login it seems
    // return next({
    //   log: 'Unauthorized acces',
    //   message: 'Access Denied'
    // })
  }

  try {
    //logic for customer dashboard getting(?)
console.log('RES LOCALS OBJECT', res.locals)
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
      console.log('DASHBOARD', res.locals.dashboard);
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

  if (phone === '' || username === '') {
    res.locals.loggedIn = false;
    return next();
  }
  //SQL query to make sure that the ID and username match an ID and username in the database
  const text = 'SELECT * FROM accounts WHERE phone=$1 AND name=$2';
  const values = [phone, username];
  res.locals.loggedIn = false;
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
      // res.locals.loggedIn = false;
      return next();
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