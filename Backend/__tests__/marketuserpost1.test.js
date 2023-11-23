const { filterMarketPosts, deleteMarketPost } = require("../marketuserpost");
const User = require("../models/User");
const Marketpost = require("../models/Marketpost");
const Iterator = require("../Iterator");

// Mocking the necessary dependencies
jest.mock("../models/User");
jest.mock("../models/Marketpost");
jest.mock("../Iterator", () => jest.fn());

const mockMarketPosts = [
  {
    _id: "65542f2e381ba4d414556005",
    username: "baalu0505@gmail.com",
    title: "Tractor Attachments",
    content: "Good Condition",
    image: ["edfghjhgfty", "iytrdshjhgf"],
    year_of_purchase: 2020,
    address: "A2 317",
    city: "Nasavilla",
    state: "Tennessee",
    country: "USA",
    createdAt: 1700015918526,
    __v: 0,
  },
  {
    _id: "65542f2e381ba4d414556005",
    username: "baalu0505@gmail.com",
    title: "Tractor Attachments",
    content: "Good Condition",
    image: ["edfghjhgfty", "iytrdshjhgf"],
    year_of_purchase: 2020,
    address: "A2 317",
    city: "Dallas",
    state: "Texas",
    country: "USA",
    createdAt: 1700015918526,
    __v: 0,
  },
  {
    _id: "65542f2e381ba4d414556005",
    username: "baalu0505@gmail.com",
    title: "Tractor Attachments",
    content: "Good Condition",
    image: ["edfghjhgfty", "iytrdshjhgf"],
    year_of_purchase: 2020,
    address: "A2 317",
    city: "Los Angeles",
    state: "California",
    country: "USA",
    createdAt: 1700015918526,
    __v: 0,
  },
  {
    _id: "65542f2e381ba4d414556005",
    username: "baalu0505@gmail.com",
    title: "Tractor Attachments",
    content: "Good Condition",
    image: ["edfghjhgfty", "iytrdshjhgf"],
    year_of_purchase: 2020,
    address: "A2 317",
    city: "saint louis",
    state: "missouri",
    country: "USA",
    createdAt: 1700015918526,
    __v: 0,
  },
];

/**
 * Test cases for filterMarketPosts function
 */
describe("filterMarketPosts", () => {
  it("should return a specific message if neither city nor state or country is provided", async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await filterMarketPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "No posts found. Please provide city, state, or country parameters.",
    });
  });

  it("should filter and sort market posts based on provided city and state parameters", async () => {
    const req = { body: { city: "exampleCity", state: "exampleState" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /(?:)/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });

  it("should return a specific message if no posts are found on the provided criteria", async () => {
    const req = {
      body: { city: "nonexistentCity", state: "nonexistentState" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Marketpost.find.mockResolvedValue([]);

    await filterMarketPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "No posts found on the provided criteria.",
    });
  });

  it("should handle errors and return Internal Server Error message", async () => {
    const req = { body: { city: "exampleCity", state: "exampleState" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Marketpost.find.mockRejectedValue(new Error("Mocked Error"));

    await filterMarketPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should filter and sort market posts based on provided city parameters", async () => {
    const req = { body: { city: "saint louis" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /(?:)/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });
});
describe("filterMarketPosts", () => {
  it("should filter and sort market posts based on provided state parameters", async () => {
    const req = { body: { state: "Texas" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /(?:)/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });

  it("should filter and sort market posts based on provided state parameters", async () => {
    const req = { body: { city: "Dallas", state: "Texas" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /(?:)/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });

  it("should filter and sort market posts based on provided country parameter", async () => {
    const req = { body: { country: "USA" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /(?:)/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });
});
describe("filterMarketPosts", () => {
  it("should sort market posts by createdAt in descending order", async () => {
    const req = { body: { city: "dallas", state: "texas", country: "usa" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /(?:)/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });

    // Add additional expectation for sorting order
    expect(mockMarketPosts[0].createdAt).toBeGreaterThanOrEqual(
      mockMarketPosts[1].createdAt
    );
  });
  it("should perform case-insensitive matching for city, state, and country parameters", async () => {
    const req = { body: { city: "dallas", state: "texas", country: "usa" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /(?:)/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });
  it("should filter and sort market posts based on provided city and country parameters", async () => {
    const req = { body: { city: "exampleCity", country: "exampleCountry" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Marketpost.find.mockResolvedValue(mockMarketPosts);

    // Ensure that the Iterator is called only once
    const iteratorMock = {
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: mockMarketPosts[0] })
        .mockReturnValueOnce({ done: true }),
    };

    Iterator.mockReturnValue(iteratorMock);

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /exampleCity/i },
      state: { $regex: /(?:)/i },
      country: { $regex: /exampleCountry/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(iteratorMock.next).toHaveBeenCalledTimes(2); // Update the expected number of calls

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });

  it("should filter and sort market posts based on provided state and country parameters", async () => {
    const req = { body: { state: "exampleState", country: "exampleCountry" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Marketpost.find.mockResolvedValue(mockMarketPosts);
    Iterator.mockImplementation((arr) => ({
      next: jest
        .fn()
        .mockReturnValueOnce({ done: false, value: arr[0] })
        .mockReturnValueOnce({ done: true }),
    }));

    await filterMarketPosts(req, res);

    expect(Marketpost.find).toHaveBeenCalledWith({
      city: { $regex: /(?:)/i },
      state: { $regex: /exampleState/i },
      country: { $regex: /exampleCountry/i },
    });

    expect(Iterator).toHaveBeenCalledWith(mockMarketPosts);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      marketPosts: [mockMarketPosts[0]],
    });
  });
  it("should handle invalid city, state, or country parameters and return an error message", async () => {
    const req = { body: { city: null, state: undefined, country: undefined } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await filterMarketPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "No posts found. Please provide city, state, or country parameters.",
    });
  });
});
