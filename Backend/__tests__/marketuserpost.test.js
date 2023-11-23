const { marketcreatePost, retrieveMarketPosts } = require("../marketuserpost");
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
        contact: "1234567890",
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
        contact: "1234567890",
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
        contact: "1234567890",
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
        contact: "1234567890",
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
    const req = {
      body: {
        username: "testUser",
        title: "Test Market Post",
        content: "This is a test market post",
        image: "test-market-image.jpg",
        createdAt: new Date(),
        contact: "1234567890",
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
  it("should return 400 for missing year_of_purchase field", async () => {
    const req = {
      body: {
        username: "testUser",
        title: "Test Post",
        content: "This is a test post",
        createdAt: "2023-01-01T12:00:00Z",
        contact: "1234567890",
        address: "123 Test Street",
        city: "Test City",
        state: "TS",
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
  it("should return 400 for an invalid phone number (more than 10 digits)", async () => {
    User.findOne.mockResolvedValue({ username: "testUser" });

    const req = {
      body: {
        username: "testUser",
        title: "Test Market Post",
        content: "This is a test market post",
        image: "test-market-image.jpg",
        createdAt: new Date(),
        contact: "123456789",
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
  });

  test("should create a new market post with a valid 10-digit phone number", async () => {
    User.findOne.mockResolvedValue({ username: "testUser" });

    const req = {
      body: {
        username: "testUser",
        title: "Test Post",
        content: "This is a test post",
        createdAt: "2023-01-01T12:00:00Z", // A valid date format
        contact: "1234567890",
        year_of_purchase: 2022,
        address: "123 Test Street",
        city: "Test City",
        state: "TS",
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

  test("should return error for a invalid phone number", async () => {
    User.findOne.mockResolvedValue({ username: "testUser" });

    const req = {
      body: {
        username: "testUser",
        title: "Test Post",
        content: "This is a test post",
        createdAt: "2023-01-01T12:00:00Z", // A valid date format
        contact: "123467890",
        year_of_purchase: 2022,
        address: "123 Test Street",
        city: "Test City",
        state: "TS",
        country: "Test Country",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid data. Please provide 10 digits in the contact field.",
    });
  });

  test("should return 400 for missing title field", async () => {
    User.findOne.mockResolvedValue({ username: "testUser" });

    const req = {
      body: {
        username: "testUser",
        content: "This is a test post",
        createdAt: "2023-01-01T12:00:00Z",
        contact: "1234567890",
        year_of_purchase: 2022,
        address: "123 Test Street",
        city: "Test City",
        state: "TS",
        country: "Test Country",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await marketcreatePost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid data. Please provide valid data in fields.",
    });
  });
});

/**
 * Test cases for retrieveMarketPosts function
 */
describe("marketUserPost", () => {
  it("should return a list of market posts when posts are available", async () => {
    // Mock Marketpost.find to return an array of valid market posts
    const validMarketPosts = [
      {
        _id: "1",
        title: "Test Market Post 1",
        content: "This is a test market post 1",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
      {
        _id: "2",
        title: "Test Market Post 2",
        content: "This is a test market post 2",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    ];
    // Mock the Marketpost.find function
    jest.spyOn(Marketpost, "find").mockResolvedValue(validMarketPosts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Check the number of calls on Marketpost.find
    expect(Marketpost.find).toHaveBeenCalledTimes(0);
  });
  it("should sort market posts by createdAt", async () => {
    // Mock Marketpost.find to return an array of market posts in a random order
    const marketPosts = [
      {
        _id: "1",
        title: "Test Market Post 1",
        content: "This is a test market post 1",
        createdAt: new Date("2022-01-01"),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
      {
        _id: "2",
        title: "Test Market Post 2",
        content: "This is a test market post 2",
        createdAt: new Date("2022-01-02"),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    ].sort(() => Math.random() - 0.5);
    jest.spyOn(Marketpost, "find").mockResolvedValue(marketPosts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Check the number of calls on Marketpost.find
    expect(Marketpost.find).toHaveBeenCalledTimes(0);
  });
});
describe("retrieveMarketPosts", () => {
  // Mock Marketpost.find to throw an error using mockImplementation
  Marketpost.find.mockImplementation(() => {
    throw new Error("Database error");
  });

  // Test case to handle errors thrown by Marketpost.find
  it("should handle errors thrown by Marketpost.find", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Expect a 500 response with an error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  // Mock Marketpost.find to throw an error using mockImplementation
  Marketpost.find.mockImplementation(() => {
    throw new TypeError("Type error");
  });

  it("should handle specific type of error thrown by Marketpost.find", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Expect a 500 response with a specific error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

describe("retrieveMarketPosts", () => {
  it("should handle empty market posts array", async () => {
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
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should handle invalid market post object", async () => {
    // Mock Marketpost.find to return a market post with missing properties
    const invalidMarketPost = { _id: "1" };
    Marketpost.find.mockResolvedValue([invalidMarketPost]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Expect a 500 response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should return a list of market posts when posts are available", async () => {
    // Mock Marketpost.find to return an array of valid market posts
    const validMarketPosts = [
      {
        _id: "1",
        title: "Test Market Post 1",
        content: "This is a test market post 1",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
      {
        _id: "2",
        title: "Test Market Post 2",
        content: "This is a test market post 2",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    ];
    // Mock the Marketpost.find function
    jest.spyOn(Marketpost, "find").mockResolvedValue(validMarketPosts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Check the number of calls on Marketpost.find
    expect(Marketpost.find).toHaveBeenCalledTimes(0);
  });

  it("should sort market posts by createdAt", async () => {
    // Mock Marketpost.find to return an array of market posts in a random order
    const marketPosts = [
      {
        _id: "1",
        title: "Test Market Post 1",
        content: "This is a test market post 1",
        createdAt: new Date("2022-01-01"),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
      {
        _id: "2",
        title: "Test Market Post 2",
        content: "This is a test market post 2",
        createdAt: new Date("2022-01-02"),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    ].sort(() => Math.random() - 0.5);
    jest.spyOn(Marketpost, "find").mockResolvedValue(marketPosts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Check the number of calls on Marketpost.find
    expect(Marketpost.find).toHaveBeenCalledTimes(0);
  });
});
describe("retrieveMarketPosts", () => {
  // Mock Marketpost.find to throw an error using mockImplementation
  Marketpost.find.mockImplementation(() => {
    throw new Error("Database error");
  });

  // Test case to handle errors thrown by Marketpost.find
  it("should handle errors thrown by Marketpost.find", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Expect a 500 response with an error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  // Mock Marketpost.find to throw an error using mockImplementation
  Marketpost.find.mockImplementation(() => {
    throw new TypeError("Type error");
  });

  it("should handle specific type of error thrown by Marketpost.find", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Expect a 500 response with a specific error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should return market posts for a valid username", async () => {
    const validUsername = "testuser";
    const marketPostsForUser = [
      {
        _id: "1",
        username: "testuser",
        title: "Test Market Post 1",
        content: "This is a test market post 1",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
      {
        _id: "2",
        username: "testuser1",
        title: "Test Market Post 2",
        content: "This is a test market post 2",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    ];
    Marketpost.find.mockResolvedValue(marketPostsForUser);

    const req = { body: { username: validUsername } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await retrieveMarketPosts(req, res);

    // Check the number of calls on Marketpost.find
    expect(Marketpost.find).toHaveBeenCalledTimes(1);
  });

  it("should return market posts sorted by createdAt in descending order", async () => {
    const marketPosts = [
      {
        _id: "1",
        username: "testuser",
        title: "Test Market Post 1",
        content: "This is a test market post 1",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
      {
        _id: "2",
        username: "testuser1",
        title: "Test Market Post 2",
        content: "This is a test market post 2",
        createdAt: new Date(),
        year_of_purchase: 2022,
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
    ];
    Marketpost.find.mockResolvedValue(marketPosts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrieveMarketPosts(req, res);

    // Ensure that the result is sorted by createdAt in descending order
    expect(marketPosts).toEqual(
      marketPosts.sort((a, b) => b.createdAt - a.createdAt)
    );
  });
});
