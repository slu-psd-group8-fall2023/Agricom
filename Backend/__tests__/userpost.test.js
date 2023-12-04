const {
  userPost,
  retrievePosts,
  addCommentToPost,
  getCommentsForPost,
  deleteUserPost,
  editPost,
} = require("../userpost");
const User = require("../models/User");
const Post = require("../models/Post");

// Mocking the necessary dependencies
jest.mock("../models/User");
jest.mock("../models/Post");

/**
 * Test cases for the UserPost
 */
describe("userPost", () => {
  it("should create a new post for an existing user", async () => {
    User.findOne.mockResolvedValue({
      username: "testUser",
      title: "Test Post",
      content: "This is a test post",
      image: "test-image.jpg",
      createdAt: new Date(),
    });

    const req = {
      body: {
        username: "testUser",
        title: "Test Post",
        content: "This is a test post",
        image: "test-image.jpg",
        createdAt: new Date(),
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Post created successfully",
      newPost: expect.any(Object),
    });
  });

  it("should return an error for a non-existing user", async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: {
        username: "nonExistentUser",
        title: "Test Post",
        content: "This is a test post",
        image: "test-image.jpg",
        createdAt: new Date(),
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found." });
  });

  it("should handle internal server errors", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const req = {
      body: {
        username: "testUser",
        title: "Test Post",
        content: "This is a test post",
        image: "test-image.jpg",
        createdAt: new Date(),
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

/**
 * Test cases for the RetrievePost
 */
describe("retrievePosts", () => {
  it("should handle empty posts array", async () => {
    // Mock Post.find to return an empty array
    Post.find.mockResolvedValue([]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrievePosts(req, res);

    // Expect a 200 response with an empty posts array
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should handle invalid post object", async () => {
    // Mock Post.find to return a post with missing properties
    const invalidPost = { _id: "1" };
    Post.find.mockResolvedValue([invalidPost]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await retrievePosts(req, res);

    // Expect a 500 response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

/**
 * Test cases for the UserPost to addcomments
 */
describe("addCommentToPost", () => {
  it("should return an error for a non-existing post", async () => {
    const postId = "nonExistentPostId";

    // Mock Post.findById to return null (non-existent post)
    Post.findOne.mockResolvedValue(null);

    const req = {
      params: { postId },
      body: {
        username: "testUser",
        content: "This is a test comment",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addCommentToPost(req, res);

    // Expect a 404 response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });

  it("should handle internal server errors", async () => {
    const postId = "testPostId";

    // Mock Post.findById to throw an error
    Post.findOne.mockRejectedValue(new Error("Database error"));

    const req = {
      params: { postId },
      body: {
        username: "testUser",
        content: "This is a test comment",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addCommentToPost(req, res);

    // Expect a 500 response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should add a comment to an existing post", async () => {
    const req = {
      params: { _id: "existing_post_id" },
      body: {
        username: "john_doe",
        content: "This is a test comment.",
        createdAt: new Date(),
      },
    };

    // Ensure the Post model returns an existing post for the given ID
    const post = { _id: "existing_post_id", Comments: [] };

    // Mock the Post.findOne and Post.save functions
    Post.findOne = jest.fn().mockResolvedValue(post);
    post.save = jest.fn().mockResolvedValue(post);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await addCommentToPost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Comment added successfully",
      post,
    });
    expect(post.Comments.length).toBe(1); // Ensure the comment was added
  });

  it("Adding a Comment to a Post with Existing Comments", async () => {
    const req = {
      params: { _id: "existing_post_id" },
      body: {
        username: "jane_doe",
        content: "Another test comment.",
        createdAt: new Date(),
      },
    };

    // Ensure the Post model returns a post with existing comments
    const post = {
      _id: "existing_post_id",
      Comments: [
        {
          username: "john_doe",
          content: "First comment",
          createdAt: new Date(),
        },
      ],
    };

    // Mock the Post.findOne and Post.save functions
    Post.findOne = jest.fn().mockResolvedValue(post);
    post.save = jest.fn().mockResolvedValue(post);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await addCommentToPost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Comment added successfully",
      post,
    });
    expect(post.Comments.length).toBe(2); // Ensure the new comment was added
  });

  it("Adding a Comment to a Post with Existing Comments", async () => {
    const req = {
      params: { _id: "existing_post_id" },
      body: {
        username: "alice_smith",
        content: "A comment on an empty post.",
        createdAt: new Date(),
      },
    };

    // Ensure the Post model returns a post with no existing comments
    const post = { _id: "existing_post_id", Comments: [] };

    // Mock the Post.findOne and Post.save functions
    Post.findOne = jest.fn().mockResolvedValue(post);
    post.save = jest.fn().mockResolvedValue(post);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await addCommentToPost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Comment added successfully",
      post,
    });
    expect(post.Comments.length).toBe(1); // Ensure the comment was added
  });
});

/**
 * Test cases for the UserPost to retrieve comments
 */
describe("getCommentsForPost", () => {
  it("should return an error for a non-existing post", async () => {
    const postId = "nonExistentPostId";

    // Mock Post.findById to return null (non-existent post)
    Post.findOne.mockResolvedValue(null);

    const req = {
      params: { postId },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCommentsForPost(req, res);

    // Expect a 404 response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });

  it("should handle internal server errors", async () => {
    const postId = "testPostId";

    // Mock Post.findById to throw an error
    Post.findOne.mockRejectedValue(new Error("Database error"));

    const req = {
      params: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCommentsForPost(req, res);

    // Expect a 500 response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should retrieve and sort comments for an existing post", async () => {
    // Define a valid post ID for an existing post
    const postId = "existing_post_id";

    // Create a mock post object with comments
    const mockPost = {
      _id: postId,
      Comments: [
        {
          username: "user1",
          content: "This is the first comment.",
          createdAt: new Date(),
        },
        {
          username: "user2",
          content: "This is the second comment.",
          createdAt: new Date(),
        },
      ],
      // Other properties of the post
    };

    // Mock the Post model's findOne method
    Post.findOne = jest.fn().mockResolvedValue(mockPost);

    // Create mock request and response objects
    const req = {
      params: { postId },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the getCommentsForPost function
    await getCommentsForPost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ comments: mockPost.Comments });
  });
});

/**
 * Test cases for deleteUserPosts function
 */
describe("deleteUserPost function", () => {
  it("should delete a market post and return success message", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Post.findByIdAndDelete to simulate successful deletion
    Post.findByIdAndDelete.mockResolvedValueOnce({});

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User post deleted successfully.",
    });
  });

  it("should return an error if the post does not exist", async () => {
    const postId = "nonexistent-post-id";
    const username = "valid-username";

    // Mock Post.findById to return null, simulating post not found
    Post.findById.mockResolvedValueOnce(null);

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User post not found." });
  });

  it("should return an error if the username is incorrect", async () => {
    const postId = "valid-post-id";
    const username = "incorrect-username";

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({
      _id: postId,
      username: "valid-username",
    });

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

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

    await deleteUserPost(req, res);

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

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User post not found." });
  });

  it("should return an error if the user does not own the post", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Post.findById to return a mock post with a different username
    Post.findById.mockResolvedValueOnce({
      _id: postId,
      username: "other-username",
    });

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. You do not own this post.",
    });
  });

  it("should return an error if there is an internal server error during deletion", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Post.findByIdAndDelete to simulate an internal server error
    Post.findByIdAndDelete.mockRejectedValueOnce(
      new Error("Internal Server Error")
    );

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should return an error if there is a database connection failure", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Post.findByIdAndDelete to simulate a database connection failure
    Post.findByIdAndDelete.mockRejectedValueOnce(
      new Error("Database Connection Failure")
    );

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
  it("should delete a market post with valid input and ignore extra fields", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Post.findByIdAndDelete to simulate successful deletion
    Post.findByIdAndDelete.mockResolvedValueOnce({});

    const req = { body: { username, postId, extraField: "extraValue" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

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

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User post not found." });
  });
  it("should delete a market post with case-insensitive username", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({ _id: postId, username });

    // Mock Post.findByIdAndDelete to simulate successful deletion
    Post.findByIdAndDelete.mockResolvedValueOnce({});

    const req = { body: { username: "valid-Username", postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User post deleted successfully.",
    });
  });
  it("should return an error if the user is not authorized to delete the post", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({
      _id: postId,
      username: "valid-username1",
    });

    const req = { body: { username, postId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUserPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. You do not own this post.",
    });
  });
});

/**
 * Test cases for editUserPosts function
 */
describe("editPost Function", () => {
  it("should edit a post successfully", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";
    const req = {
      body: {
        postId,
        username,
        title: "Updated Title",
        content: "Updated Content",
        image: "new-image-url",
        createdAt: new Date(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({
      _id: postId,
      username,
      title: "Current Title",
      content: "Current Content",
      image: "current-image-url",
      createdAt: new Date(),
      save: jest.fn().mockResolvedValueOnce({
        _id: postId,
        username,
        title: "Updated Title",
        content: "Updated Content",
        image: "new-image-url",
        createdAt: new Date(),
      }),
    });

    await editPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if the post is not found", async () => {
    const req = {
      body: {
        postId: "non-existent-post-id",
        username: "valid-username",
        title: "New Title",
        content: "Updated Content",
        image: "new-image-url",
        createdAt: new Date(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Post.findById to return null, simulating a post not found
    Post.findById.mockResolvedValueOnce(null);

    await editPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });

  it("should return 403 if the user is not authorized to edit the post", async () => {
    const postId = "valid-post-id";
    const username = "valid-username";

    const req = {
      body: {
        postId,
        username: "different-username",
        title: "New Title",
        content: "Updated Content",
        image: "new-image-url",
        createdAt: new Date(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Post.findById to return a mock post
    Post.findById.mockResolvedValueOnce({ _id: postId, username });

    await editPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. You do not own this post.",
    });
  });

  it("should handle internal server error", async () => {
    const req = {
      body: {
        postId: "valid-post-id",
        username: "valid-username",
        title: "New Title",
        content: "Updated Content",
        image: "new-image-url",
        createdAt: new Date(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Post.findById to throw an error, simulating an internal server error
    Post.findById.mockRejectedValueOnce(new Error("Some internal error"));

    await editPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
  it("should handle missing or invalid input fields", async () => {
    const req = {
      body: {
        // Missing postId or other required fields
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });

  it("should handle invalid date format", async () => {
    const req = {
      body: {
        postId: "valid-post-id",
        username: "valid-username",
        title: "New Title",
        content: "Updated Content",
        image: "new-image-url",
        createdAt: "",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });

  it("should handle editing post with empty content or title", async () => {
    const req = {
      body: {
        postId: "valid-post-id",
        username: "valid-username",
        title: "",
        content: "Updated Content",
        image: "new-image-url",
        createdAt: new Date(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editPost(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });
});
