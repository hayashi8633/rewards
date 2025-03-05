import express from 'express';
import CORS from 'cors';
import cookieParser from 'cookie-parser';
// NOTE: I installed pg, cors, and dotenv (they're necessary)
import { createClient } from '@supabase/supabase-js';
import { userRouter } from './routes/userRouter.js';
import { busRouter } from './routes/busRouter.js';
import dotenv from 'dotenv';
// import bodyParser from "body-parser";
import { checkDatabaseConnection } from './models/models.js';

const app = express();
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// console.log('supabaseUrl',supabaseUrl)
const supabaseKey = process.env.SUPABASE_KEY;
// const PORT = process.env.PORT;
const supabase = createClient(supabaseUrl, supabaseKey);
const PORT = process.env.PORT;
checkDatabaseConnection();

//          << Necessary >>
// CORS STUFF
// run npm install cors
app.use(
  CORS({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
// Converts incoming json in to js objects.
app.use(express.json());
app.use(cookieParser()); // to read cookies

// idk what these do but it's necessary just keep it
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json()); // We don't need body parser if we're using express.json()

// lets us know backend is running
app.get('/', (req, res) => {
  console.log('🫚 Root Directory Accessed.');
  return res.status(200).json('👋 Hello from the backend');
});

// Routing for the user "database"
app.use('/api/users', userRouter);
app.use('/api/bus', busRouter);

// Generic catch all for any bad requests
app.use((req, res) => {
  console.log('😶 404 Response Sent!');
  res.status(404).send('404 Page Not Found');
});

// Generic Placeholder errormessage
app.use((err, req, res, next) => {
  // Throw an error console log
  console.log('❌ Error Thrown');
  // Placeholder error if we fail to create error handling for the application
  const defaultError = {
    log: 'Express error handler caught an unknown error.',
    status: 500,
    message: { err: 'An error occured.' },
  };
  // Assign the error object any new error information that gets sent here
  const errorObj = Object.assign(defaultError, err);
  // slam that shit into the console log
  console.log(errorObj.log);
  // return the error status message and the error status code back to the requester
  return res.status(errorObj.status).send(errorObj.message);
});

//supertest export
export { supabase, app };
