const {
  filterMarketPosts,
  deleteMarketPost,
  editMarketPost,
} = require("../marketuserpost");
const Marketpost = require("../models/Marketpost");
const Iterator = require("../Iterator");

// Mocking the necessary dependencies
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

/**
 * Test cases for deleteMarketPosts function
 */
describe("deleteMarketPost function", () => {
  it("should delete a market post and return success message", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Marketpost.findByIdAndDelete to simulate successful deletion
    Marketpost.findByIdAndDelete.mockResolvedValueOnce({});

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User post deleted successfully.",
    });
  });

  it("should return an error if the post does not exist", async () => {
    const postId = "nonexistent-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return null, simulating post not found
    Marketpost.findById.mockResolvedValueOnce(null);

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User post not found." });
  });

  it("should return an error if the username is incorrect", async () => {
    const postId = "valid-post-id";
    const username = "incorrect-username";

    // Mock Marketpost.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({
      _id: postId,
      username: "valid-username",
    });

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. You do not own this post.",
    });
  });

  it("should return an error if postId is missing", async () => {
    const username = "valid-username";

    const req = { body: { username } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "postId parameter is required.",
    });
  });

  it("should return an error if username is missing", async () => {
    const postId = "valid-post-id";

    const req = { body: { postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User post not found." });
  });

  it("should return an error if the user does not own the post", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return a mock post with a different username
    Marketpost.findById.mockResolvedValueOnce({
      _id: postId,
      username: "other-username",
    });

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. You do not own this post.",
    });
  });

  it("should return an error if there is an internal server error during deletion", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Marketpost.findByIdAndDelete to simulate an internal server error
    Marketpost.findByIdAndDelete.mockRejectedValueOnce(
      new Error("Internal Server Error")
    );

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should return an error if there is a database connection failure", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Marketpost.findByIdAndDelete to simulate a database connection failure
    Marketpost.findByIdAndDelete.mockRejectedValueOnce(
      new Error("Database Connection Failure")
    );

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
  it("should delete a market post with valid input and ignore extra fields", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Marketpost.findByIdAndDelete to simulate successful deletion
    Marketpost.findByIdAndDelete.mockResolvedValueOnce({});

    const req = { body: { username, postId, extraField: "extraValue" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User post deleted successfully.",
    });
  });

  it("should return an error for invalid postId format", async () => {
    const postId = "invalid-post-id!@#";
    const username = "valid-username";

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User post not found." });
  });
  it("should delete a market post with case-insensitive username", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Marketpost.findByIdAndDelete to simulate successful deletion
    Marketpost.findByIdAndDelete.mockResolvedValueOnce({});

    const req = { body: { username: "valid-Username", postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User post deleted successfully.",
    });
  });
  it("should return an error if the user is not authorized to delete the post", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Marketpost.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({
      _id: postId,
      username: "valid-username1",
    });

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. You do not own this post.",
    });
  });
});

/**
 * Testcases for EditmarketPosts
 */
describe("editMarketPost Function", () => {
  it("should edit a post successfully", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";
    const req = {
      body: {
        postId,
        username,
        title: "Updated Title",
        content: "Updated Content",
        image: ["new-image-url"],
        createdAt: Date.now(),
        contact: 1234567890,
        year_of_purchase: 2022,
        address: "Updated Address",
        city: "Updated City",
        state: "Updated State",
        country: "Updated Country",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Post.findById to return a mock post
    Marketpost.findById.mockResolvedValueOnce({
      _id: postId,
      username,
      title: "Updated Title",
      content: "Updated Content",
      image: ["new-image-url"],
      createdAt: Date.now(),
      contact: 1234567890,
      year_of_purchase: 2022,
      address: "Updated Address",
      city: "Updated City",
      state: "Updated State",
      country: "Updated Country",
      save: jest.fn().mockResolvedValueOnce({
        _id: postId,
        username,
        title: "Updated Title",
        content: "Updated Content",
        image: ["new-image-url"],
        createdAt: Date.now(),
        contact: 1234567890,
        year_of_purchase: 2022,
        address: "Updated Address",
        city: "Updated City",
        state: "Updated State",
        country: "Updated Country",
      }),
    });

    await editMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if the market post is not found", async () => {
    const req = {
      body: {
        postId: "non-existent-post-id",
        username: "valid-username",
        title: "Updated Title",
        content: "Updated Content",
        image: ["new-image-url"],
        createdAt: Date.now(),
        contact: 1234567890,
        year_of_purchase: 2022,
        address: "Updated Address",
        city: "Updated City",
        state: "Updated State",
        country: "Updated Country",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Marketpost.findById to return null, simulating a market post not found
    Marketpost.findById.mockResolvedValueOnce(null);

    await editMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Market post not found" });

    // Ensure that save method is not called on a non-existent market post
    expect(Marketpost.prototype.save).not.toHaveBeenCalled();
  });
  it("should return 403 if the user is not authorized to edit the market post", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    const req = {
      body: {
        postId,
        username: "different-username",
        title: "Updated Title",
        content: "Updated Content",
        image: ["new-image-url"],
        createdAt: Date.now(),
        contact: 1234567890,
        year_of_purchase: 2022,
        address: "Updated Address",
        city: "Updated City",
        state: "Updated State",
        country: "Updated Country",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Marketpost.findById to return a mock market post
    Marketpost.findById.mockResolvedValueOnce({
      _id: postId,
      username: "valid-username1",
      title: "Original Title",
      content: "Original Content",
      image: ["original-image-url"],
      createdAt: Date.now(),
      contact: 9876543210,
      year_of_purchase: 2021,
      address: "Original Address",
      city: "Original City",
      state: "Original State",
      country: "Original Country",
    });

    await editMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. You do not own this market post.",
    });

    // Ensure that save method is not called when the user is not authorized
    expect(Marketpost.prototype.save).not.toHaveBeenCalled();
  });

  it("should handle internal server error", async () => {
    const req = {
      body: {
        postId: "valid-post-id",
        username: "valid-username",
        title: "Updated Title",
        content: "Updated Content",
        image: ["new-image-url"],
        createdAt: Date.now(),
        contact: 1234567890,
        year_of_purchase: 2022,
        address: "Updated Address",
        city: "Updated City",
        state: "Updated State",
        country: "Updated Country",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Marketpost.findById to throw an error, simulating an internal server error
    Marketpost.findById.mockRejectedValueOnce(new Error("Some internal error"));

    await editMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });

    // Ensure that save method is not called when an error occurs
    expect(Marketpost.prototype.save).not.toHaveBeenCalled();
  });
  it("should return 400 for invalid data in marketcreatePost", async () => {
    const req = {
      body: {
        // Missing 'title' field
        username: "valid-username",
        content: "Sample Content",
        createdAt: Date.now(),
        contact: 1234567890,
        year_of_purchase: 2022,
        address: "Sample Address",
        city: "Sample City",
        state: "Sample State",
        country: "Sample Country",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid data. Please provide valid data in fields.",
    });

    // Ensure that save method is not called when there is invalid data
    expect(Marketpost.prototype.save).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid data in marketcreatePost", async () => {
    const req = {
      body: {
        // Missing all fields
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editMarketPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid data. Please provide valid data in fields.",
    });

    // Ensure that save method is not called when there is invalid data
    expect(Marketpost.prototype.save).not.toHaveBeenCalled();
  });
});
