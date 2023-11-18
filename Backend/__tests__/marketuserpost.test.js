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
});