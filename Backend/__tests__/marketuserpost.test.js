const { marketcreatePost,retrieveMarketPosts,filterMarketPosts,deleteMarketPost } = require('../marketuserpost');
const User = require('../models/User');
const Marketpost = require('../models/Marketpost')
// Mocking the necessary dependencies
jest.mock('../models/User');
jest.mock('../models/Marketpost');
/**
 * Test cases for marketUserPost function
 */
describe('marketUserPost', () => {
  it('should create a new market post for an existing user', async () => {
    User.findOne.mockResolvedValue({ username: 'testUser' });

    const req = {
      body: {
        username: 'testUser',
        title: 'Test Market Post',
        content: 'This is a test market post',
        image: 'test-market-image.jpg',
        createdAt:new Date(),
        year_of_purchase: 2022,
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Market Post created successfully',
      newMarketPost: expect.any(Object),
    });
  });

  it('should return an error for a non-existing user', async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: {
        username: 'nonExistentUser',
        title: 'Test Market Post',
        content: 'This is a test market post',
        image: 'test-market-image.jpg',
        createdAt:new Date(),
        year_of_purchase: 2022,
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
  });

  it('should handle internal server errors', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const req = {
      body: {
        username: 'testUser',
        title: 'Test Market Post',
        content: 'This is a test market post',
        image: 'test-market-image.jpg',
        createdAt:new Date(),
        year_of_purchase: 2022,
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('should return an error for incomplete data', async () => {
    const req = {
      body: {
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await marketcreatePost(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data. Please provide valid data in fields.' });
  });

  it('should return an error for an invalid createAt Date field', async () => {
    const req = {
      body: {
        username: 'testUser',
        title: 'Test Market Post',
        content: 'This is a test market post',
        image: 'thes is image', 
        createdAt: 'invalid',// invalid date value
        year_of_purchase: 2022,
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await marketcreatePost(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date. Please provide a valid date in the createdAt field.' });
  });


  it('should handle missing address field', async () => {
    User.findOne.mockResolvedValue({ username: 'testUser' });

    const req = {
      body: {
        username: 'testUser',
        title: 'Test Market Post',
        content: 'This is a test market post',
        image: 'test-market-image.jpg',
        createdAt: new Date(),
        year_of_purchase: 2022,
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data. Please provide valid data in fields.' });
  });
  

});