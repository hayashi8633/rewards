//   <<Imports>>
import express from 'express';
import { busController } from '../controllers/busController.js';
// import { userController } from '../controllers/userController.js';

// Create a new router
const busRouter = express.Router();

// Dashboard for Business
busRouter.get('/busDashboard', busController.getDash, (req, res) => {
  return res.status(200).json(res.locals.allCustomers);
});

// Adding a customer into the database
busRouter.post('/addCustomer', busController.addCustomer, (req, res) => {
  return res.status(200).send('customer added!');
});

// Changing the number of stars a customer has
busRouter.post('/addStar', busController.addStar, (req, res) => {
  return res.status(200).send('stars changed!');
});

// ADD rewards to the database
busRouter.post('/addRewards', busController.addReward, (req, res) => {
  return res.status(200).send('Rewards Program added!');
});
// GET rewards from the database
busRouter.get('/getRewards', busController.getRewards, (req, res) => {
  return res.status(200).json(res.locals.rewards);
});

// DELETE rewards from the database
busRouter.delete('/deleteReward/:businessName/:id', busController.deleteReward, (req, res) => {
  return res.status(200).json(res.locals.rewards);
});


export { busRouter };
