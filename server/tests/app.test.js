// filepath: /Users/chapmanchappelle/Documents/GitHub/Codesmith/Projects/iteration/rewards/server/tests/app.test.js
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { app as mainApp } from '../app.js';
// Import routes
import { userRouter } from '../routes/userRouter.js';
import { busRouter } from '../routes/busRouter.js';
// Import pool to be mocked
import { checkDatabaseConnection, pool } from '../models/models.js';

// Use jest to mock the pool module
jest.mock('../models/models.js', () => ({
  pool: {
    query: jest.fn(),
  },
  checkDatabaseConnection: jest.fn(),
}));

//tests for user routes
describe('User Router', () => {
  let testApp;

  // Setup test environment before tests run
  beforeAll(() => {
    testApp = express();
    testApp.use(express.json());
    testApp.use(cookieParser());
    // Mount routes
    testApp.use('/api/user', userRouter);
    testApp.use((err, req, res, next) => {
      console.error('Error caught in middleware:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    });
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/user/login returns logged in user info on success', async () => {
    // Create a fake result that simulates a successful login from the DB
    const mockDBResponse = {
      rows: [{ name: 'rachel', user_type: 'Customer' }],
      rowCount: 1,
    };

    // For the login route, which uses a callback style, we support both callback and promise usage.
    pool.query.mockImplementation((query, data, callback) => {
      if (typeof callback === 'function') {
        callback(null, mockDBResponse);
      }
      return Promise.resolve(mockDBResponse);
    });

    // Act: call the endpoint with Supertest
    const response = await request(testApp)
      .post('/api/user/login')
      .send({ phone: '1234567890', password: 'password' });

    //Assert: verify status code and response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      username: 'rachel',
      usertype: 'customer', // converted to lowercase in middleware
      phone: '1234567890',
    });
  });

  it('POST /api/user/register registers a new user', async () => {
    // For registration, two queries occur:
    // 1. Check if the phone number exists.
    // 2. Insert the new user.
    pool.query
      .mockImplementationOnce((query, data, callback) => {
        // Simulate that the phone does not already exist.
        const result = { rows: [{ exists: false }] };
        if (typeof callback === 'function') {
          callback(null, result);
        }
        return Promise.resolve(result);
      })
      .mockImplementationOnce((query, data, callback) => {
        // Simulate a successful INSERT operation.
        const result = { rows: [] };
        if (typeof callback === 'function') {
          callback(null, result);
        }
        return Promise.resolve(result);
      });

    // Act: call the registration endpoint with Supertest
    const response = await request(testApp).post('/api/user/register').send({
      username: 'rachel',
      phone: '1234567890',
      password: 'password',
      usertype: 'Customer',
    });

    //Assert: verify status code and response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      username: 'rachel',
      usertype: 'customer', // middleware converts to lowercase
      phone: '1234567890',
    });
  });

  it('GET /api/user/dashboard returns dashboard info when logged in', async () => {
    // Step 1: Simulate the isLoggedIn query.
    pool.query
      .mockResolvedValueOnce({
        rows: [{ name: 'rachel', phone: '1234567890' }],
      })
      // Step 2: Simulate the phone lookup query in getDash.
      .mockResolvedValueOnce({
        rows: [{ phone: '1234567890' }],
      })
      // Step 3: Simulate the custDash query in getDash.
      .mockImplementationOnce((query, data, callback) => {
        const result = {
          rows: [
            {
              business_name: 'Test Business',
              num_of_visits: 5,
              phone: '1234567890',
              customer_name: 'rachel',
            },
          ],
        };
        if (typeof callback === 'function') {
          callback(null, result);
        }
        return Promise.resolve(result);
      });

    // Act: call the dashboard endpoint with cookies as a single string.
    const response = await request(testApp)
      .get('/api/user/dashboard?customerName=rachel')
      .set('Cookie', 'phone=1234567890; username=rachel');

    //Assert: verify status code and response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        business_name: 'Test Business',
        num_of_visits: 5,
        phone: '1234567890',
        customer_name: 'rachel',
      },
    ]);
  });

  it('GET /api/user/logout logs out user by clearing cookies', async () => {
    //Act: call the logout endpoint
    const response = await request(testApp).get('/api/user/logout');

    //Assert: verify status code and response
    expect(response.status).toBe(200);
    expect(response.text).toBe('logged out!');
  });
});

describe('Business Router', () => {
  let testApp;

  // Setup test environment before tests run
  beforeAll(() => {
    testApp = express();
    testApp.use(express.json());
    testApp.use(cookieParser());
    // Mount routes
    testApp.use('/api/bus', busRouter);
    testApp.use((err, req, res, next) => {
      console.error('Error caught in middleware:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    });
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/bus/busDashboard returns business dashboard info', async () => {
    const mockDBResponse = {
      rows: [
        {
          customer_name: 'rachel',
          customer_phone: '1234567890',
          id: 1,
          num_of_visits: 5,
        },
      ],
    };

    pool.query.mockResolvedValueOnce(mockDBResponse);

    //Act: call the busDashboard endpoint with a test business name
    const response = await request(testApp).get(
      '/api/bus/busDashboard?businessName=Test Business'
    );

    //Assert: verify status code and response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        name: 'rachel',
        phone: '1234567890',
        num_of_visits: 5,
      },
    ]);
  });

  it('POST  /api/bus/addCustomer registers a new customer for current business', async () => {
    //simulate INSERT by returning empty row array
    pool.query.mockResolvedValueOnce({ rows: [] });

    //Act: call the addCustomer endpoint
    const response = await request(testApp).post('/api/bus/addCustomer').send({
      business_name: 'Test Business',
      phone: '1234567890',
      name: 'rachel',
    });

    //Assert: verify status code and response
    expect(response.status).toBe(200);
    expect(response.text).toBe('customer added!');
  });

  it('POST /api/bus/addStar updates customer star count', async () => {
    //simulate UPDATE operation
    pool.query.mockResolvedValueOnce({ rows: [] });

    //Act: call the addStar endpoint
    const response = await request(testApp).post('/api/bus/addStar').send({
      business_name: 'Test Business',
      amount: 1,
      phone: '1234567890',
    });

    //Assert: verify the status code and response
    expect(response.status).toBe(200);
    expect(response.text).toBe('stars changed!');
  });
});
