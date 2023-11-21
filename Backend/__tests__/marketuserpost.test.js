const {
  marketcreatePost,
  retrieveMarketPosts,
  filterMarketPosts,
  deleteMarketPost,
} = require("../marketuserpost");
const User = require("../models/User");
const Marketpost = require("../models/Marketpost");
const Iterator = require("../Iterator");

// Mocking the necessary dependencies
jest.mock("../models/User");
jest.mock("../models/Marketpost");
jest.mock("../Iterator", () => jest.fn());

/**
 * Test cases for marketUserPost function
 */
describe("marketUserPost", () => {
  it("should create a new market post for an existing user", async () => {
    User.findOne.mockResolvedValue({ username: "testUser" });

    const req = {
      body: {
        username: "testUser",
        title: "Test Market Post",
        content: "This is a test market post",
        image: "test-market-image.jpg",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Market Post created successfully",
      newMarketPost: expect.any(Object),
    });
  });

  it("should return an error for a non-existing user", async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: {
        username: "nonExistentUser",
        title: "Test Market Post",
        content: "This is a test market post",
        image: "test-market-image.jpg",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found." });
  });

  it("should handle internal server errors", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const req = {
      body: {
        username: "testUser",
        title: "Test Market Post",
        content: "This is a test market post",
        image: "test-market-image.jpg",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should return an error for incomplete data", async () => {
    const req = {
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid data. Please provide valid data in fields.",
    });
  });

  it("should return an error for an invalid createAt Date field", async () => {
    const req = {
      body: {
        username: "testUser",
        title: "Test Market Post",
        content: "This is a test market post",
        image: "thes is image",
        createdAt: "invalid", // invalid date value
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Invalid date. Please provide a valid date in the createdAt field.",
    });
  });

  it("should handle missing address field", async () => {
    User.findOne.mockResolvedValue({ username: "testUser" });

    const req = {
      body: {
        username: "testUser",
        title: "Test Market Post",
        content: "This is a test market post",
        image: "test-market-image.jpg",
        createdAt: new Date(),
        year_of_purchase: 2022,
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid data. Please provide valid data in fields.",
    });
  });


  /**
 * Test cases for retrieveMarketPosts function
 */
describe('retrieveMarketPosts', () => {
  it('should handle empty market posts array', async () => {
      // Mock Marketpost.find to return an empty array
      Marketpost.find.mockResolvedValue([]);
  
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await retrieveMarketPosts(req, res);
  
      // Expect a 500 response with an empty market posts array
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({error: 'Internal Server Error' });
    });

  it('should handle invalid market post object', async () => {
    // Mock Marketpost.find to return a market post with missing properties
    const invalidMarketPost = { _id: '1' };
    Marketpost.find.mockResolvedValue([invalidMarketPost]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    

    await retrieveMarketPosts(req, res);

    // Expect a 500 response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('should return a list of market posts when posts are available', async () => {
      // Mock Marketpost.find to return an array of valid market posts
      const validMarketPosts = [
        {
          _id: '1',
          title: 'Test Market Post 1',
          content: 'This is a test market post 1',
          createdAt: new Date(),
          year_of_purchase: 2022,
          address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
        },
        {
          _id: '2',
          title: 'Test Market Post 2',
          content: 'This is a test market post 2',
          createdAt: new Date(),
          year_of_purchase: 2022,
          address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
        },
      ];
      // Mock the Marketpost.find function
      jest.spyOn(Marketpost, 'find').mockResolvedValue(validMarketPosts);
    
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      await retrieveMarketPosts(req, res);
    
      // Check the number of calls on Marketpost.find
      expect(Marketpost.find).toHaveBeenCalledTimes(3);
    });
});
});
