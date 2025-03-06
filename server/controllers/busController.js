// Import the users object
// import db from "../models/models.js"

import { pool } from '../models/models.js';
import { supabase } from '../app.js';

const busController = {};

// TODO NOTE FOR RACHEL: REMEMBER THE REQ.HEADERS THING (put in handleClick header "user": "username" and you can have access to it and pass it as a param to the backend)

busController.addCustomer = async (req, res, next) => {
  try {
    console.log('🚀 add customer middleware reached!');
    console.log('Request body: ', req.body);
    // console.log('request query:', req.query);
    //logic for adding a customer to the rewards program
    // check if phone # exists first
    // if exists, error message
    // not exists, add the information of the customer to database
    // phone number, name, number of visits

    const data = [req.body.business_name, req.body.phone, req.body.name];

    // this query will add ONLY existing users from the "accounts" table
    // it'll get the phone number and name of the person from the front end and go through all the data in the "accounts" table- if a person with a matching name and phone # come up, it'll add their name, phone number, and number of visits (automatically set to 0) to the "business_info" table
    const addingCustomer = `INSERT INTO business_info (business_name, phone, num_of_visits, customer_name) 
      SELECT $1, $2, 0, $3
      WHERE EXISTS ( 
        SELECT 1 FROM accounts 
        WHERE phone = $2 
      );`;
    const result = await pool.query(addingCustomer, data);
    return next();
  } catch (err) {
    // error handling
    console.log('error: ', err);
    return next({
      log: 'log: Error adding customer',
      message: 'Message: Error adding customer',
    });
  }
};

// number of visits increase
busController.addStar = async (req, res, next) => {
  try {
    // serach the phone# in database
    // if exists add number of visits
    // if not, add Customer

    // req.body.phone is included in data because each component that is shown on the business dashboard should have a phone number associated with it (not just displayed) -> if i console.log(phone) in the onclick, the phone number of that specific user should be console logged
    // We're getting the user from res.body
    const data = [req.body.business_name, req.body.amount, req.body.phone];
    console.log('Data from POST request in addStar: ', req.body);

    const addingStar =
      'UPDATE business_info SET num_of_visits=num_of_visits + $2 WHERE business_name=$1 AND phone=$3';
    const result = await pool.query(addingStar, data);
    res.locals.updatedStars = result.row[0].num_of_visits; // Wing added code
    // res.locals.addedStar = result.rows;
    // console.log('result.rows from addStar middleware: ', result)
    return next();
  } catch (err) {
    // error handling
    return next({
      log: 'log: Error adding a star',
      message: 'Message: Error adding a star',
    });
  }
};

//ADD REWARD CONTROLLER//
busController.addReward = async (req, res, next) => {
  try {
    const data = [req.body.business_name, req.body.num_of_stars, req.body.type];

    const addingReward = `INSERT INTO rewards (business_name, num_of_stars, type) VALUES ($1, $2, $3)`;
    const result = await pool.query(addingReward, data);
    res.locals.rewards = result.row;
    return next();
  } catch (err) {
    console.error('from the reward controller', err);
    return next({
      log: 'log: Error adding a reward',
      message: 'Message: Error adding a reward',
    });
  }
};
//GET REWARD CONTROLLER//
busController.getRewards = async (req, res, next) => {
  try {
    console.log('🤯 get rewards middleware reached!');
    //grab the business name from the request if falsey throw an error
    const { businessName } = req.query;
    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }
    //grab matching data from the database
    const query = `SELECT * FROM rewards 
    WHERE business_name = $1`;
    const result = await pool.query(query, [businessName]);
    //if database empty throw an error
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No rewards found' });
    }
    // Store result in res.locals
    res.locals.rewards = result.rows;
    console.log('Business Name:', businessName);
    console.log('Query result:', result);

    return next();
  } catch (err) {
    console.error('Error in getRewards controller:', err);
    return next({
      log: 'Error at busController.getRewards',
      message: 'Error getting rewards',
    });
  }
};

//DELETE REWARD CONTROLLER//
busController.deleteReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`from deleteReward:`, id);
    // if (!id) {
    //   return res.status(400).json({ error: "bad id" });
    // }
    //grab matching data from the database
    const values = [id];
    const query = `DELETE FROM rewards 
    WHERE id = $1`;
    await pool.query(query, values);
    //if database empty throw an error
    // if (result.rows.length === 0) {
    //   return res.status(404).json({ message: "No reward with that ID found" });
    // }
    return next();
  } catch (err) {
    console.error('Error in deleteRewards controller:', err);
    return next({
      log: 'Error at busController.deleteRewards',
      message: 'Error getting delete',
    });
  }
};

busController.isLoggedIn = (req, res, next) => {
  const { phone, username } = req.cookies;
  console.log('phone, ', phone);
  console.log('username, ', username);
  const endpoint = req.query.businessName;

  console.log('endpoint: ', endpoint);

  if (phone === '' || username === '') {
    res.locals.loggedIn = false;
    return next();
  }
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
    }
  });
};

// 🪽 🪽 🪽 🪽 🪽 Wing's code begins 🪽 🪽 🪽 🪽 🪽

busController.removeStar = async (req, res) => {
  try {
    const { business_name, amount, phone } = req.body;
    console.log('🔻 Processing star redemption:', req.body);

    const updateQuery = `
        UPDATE business_info 
        SET num_of_visits = GREATEST(num_of_visits + $2, 0) 
        WHERE business_name = $1 AND phone = $3
        RETURNING num_of_visits;
      `;

    const result = await pool.query(updateQuery, [
      business_name,
      amount,
      phone,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }
    console.log(
      '✅ Redemption successful. Updated stars:',
      result.rows[0].num_of_visits
    );
    return res.status(200).json({
      message: 'Stars updated successfully!',
      stars: result.rows[0].num_of_visits,
    });
  } catch (err) {
    console.error('Error updating stars:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// 🪽 🪽 🪽 🪽 🪽 Wing's code end 🪽 🪽 🪽 🪽 🪽

// This middleware will be used to login the customer
busController.getDash = async (req, res, next) => {
  console.log('Business DASHBOARD middleware reached');
  try {
    //logic for business dashboard getting(?)
    // get names of all rewards members, the number of times they've visited, customer's phone number and the customer's name
    // display it (aka feed it to the front end):D

    // Get business name from req.query
    const data = [req.query.businessName];

    console.log('data from busController.getDash: ', data);
    // TODO i think the "coalesce(b.num_of_visits, 0)" could become an issue cuz it changes NULL values to 0 automatically but our table doesn't have NULLs, and because we kinda want the database to reset to 0 after it hits 10
    // might also have to get rid of the quotes around ${data}
    const busDash = `SELECT a.name AS customer_name, 
      a.phone AS customer_phone, a.id as id,
        CASE 
          WHEN b.num_of_visits IS NULL OR b.num_of_visits > 10 THEN 0
          ELSE b.num_of_visits
        END AS num_of_visits 
      FROM accounts a 
      INNER JOIN business_info b ON a.name = b.customer_name AND b.business_name = $1 
      WHERE a.user_type = 'Customer' 
      ORDER BY id DESC`;

    // const result = await pool.query(busDash);
    const queryResult = await pool.query(busDash, data); // Renamed result -> queryResult because it's more descriptive and harder to confuse with the response we'd send back

    // Transform response for front end
    const response = queryResult.rows.map((row) => ({
      id: row.id,
      name: row.customer_name,
      phone: row.customer_phone,
      num_of_visits: row.num_of_visits,
    }));
    // res.locals.allCustomers = result.rows;
    res.locals.allCustomers = response;
    return next();
  } catch (err) {
    // error handling
    return next({
      log: 'log: Error getting the business dashboard',
      message: 'Message: Error getting the business dashboard',
    });
  }
};

export { busController };
