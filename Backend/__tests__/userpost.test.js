const { userPost,retrievePosts,addCommentToPost,getCommentsForPost } = require('../userpost'); 
const User = require('../models/User');
const Post = require('../models/Post');

// Mocking the necessary dependencies
jest.mock('../models/User');
jest.mock('../models/Post');



/**
 * Test cases for the UserPost
 */
describe('userPost', () => {
  it('should create a new post for an existing user', async () => {
    User.findOne.mockResolvedValue({username: 'testUser',
    title: 'Test Post',
    content: 'This is a test post',
    image: 'test-image.jpg',
    createdAt: new Date() });

    const req = {
      body: {
        username: 'testUser',
        title: 'Test Post',
        content: 'This is a test post',
        image: 'test-image.jpg',
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
      message: 'Post created successfully',
      newPost: expect.any(Object),
    });
  });

  it('should return an error for a non-existing user', async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: {
        username: 'nonExistentUser',
        title: 'Test Post',
        content: 'This is a test post',
        image: 'test-image.jpg',
        createdAt: new Date(),
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
  });

  it('should handle internal server errors', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const req = {
      body: {
        username: 'testUser',
        title: 'Test Post',
        content: 'This is a test post',
        image: 'test-image.jpg',
        createdAt: new Date(),
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});


describe('addCommentToPost', () => {

  it('should return an error for a non-existing post', async () => {
    const postId = 'nonExistentPostId';

    // Mock Post.findById to return null (non-existent post)
    Post.findOne.mockResolvedValue(null);

    const req = {
      params: { postId },
      body: {
        username: 'testUser',
        content: 'This is a test comment',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addCommentToPost(req, res);

    // Expect a 404 response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });

  it('should handle internal server errors', async () => {
    const postId = 'testPostId';

    // Mock Post.findById to throw an error
    Post.findOne.mockRejectedValue(new Error('Database error'));

    const req = {
      params: { postId },
      body: {
        username: 'testUser',
        content: 'This is a test comment',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addCommentToPost(req, res);

    // Expect a 500 response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });


  it('should add a comment to an existing post', async () => {
    const req = {
      params: { _id: 'existing_post_id' },
      body: {
          username: 'john_doe',
          content: 'This is a test comment.',
          createdAt: new Date()
      }
  };
  
  // Ensure the Post model returns an existing post for the given ID
  const post = { _id: 'existing_post_id', Comments: [] };
  
  // Mock the Post.findOne and Post.save functions
  Post.findOne = jest.fn().mockResolvedValue(post);
  post.save = jest.fn().mockResolvedValue(post);
  
  const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
  };
  
  // Call the function
  await addCommentToPost(req, res);
  
  // Assertions
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ message: 'Comment added successfully', post });
  expect(post.Comments.length).toBe(1); // Ensure the comment was added
   });

it('Adding a Comment to a Post with Existing Comments', async () => {
   const req = {
    params: { _id: 'existing_post_id' },
    body: {
        username: 'jane_doe',
        content: 'Another test comment.',
        createdAt: new Date()
    }
};

// Ensure the Post model returns a post with existing comments
const post = {
    _id: 'existing_post_id',
    Comments: [{ username: 'john_doe', content: 'First comment', createdAt: new Date() }]
};

// Mock the Post.findOne and Post.save functions
Post.findOne = jest.fn().mockResolvedValue(post);
post.save = jest.fn().mockResolvedValue(post);

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

// Call the function
await addCommentToPost(req, res);

// Assertions
expect(res.status).toHaveBeenCalledWith(201);
expect(res.json).toHaveBeenCalledWith({ message: 'Comment added successfully', post });
expect(post.Comments.length).toBe(2); // Ensure the new comment was added

});

it('Adding a Comment to a Post with Existing Comments', async () => {

const req = {
    params: { _id: 'existing_post_id' },
    body: {
        username: 'alice_smith',
        content: 'A comment on an empty post.',
        createdAt: new Date()
    }
};

// Ensure the Post model returns a post with no existing comments
const post = { _id: 'existing_post_id', Comments: [] };

// Mock the Post.findOne and Post.save functions
Post.findOne = jest.fn().mockResolvedValue(post);
post.save = jest.fn().mockResolvedValue(post);

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

// Call the function
await addCommentToPost(req, res);

// Assertions
expect(res.status).toHaveBeenCalledWith(201);
expect(res.json).toHaveBeenCalledWith({ message: 'Comment added successfully', post });
expect(post.Comments.length).toBe(1); // Ensure the comment was added


});

});

describe('getCommentsForPost', () => {

  it('should return an error for a non-existing post', async () => {
    const postId = 'nonExistentPostId';

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
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });

  it('should handle internal server errors', async () => {
    const postId = 'testPostId';

    // Mock Post.findById to throw an error
    Post.findOne.mockRejectedValue(new Error('Database error'));

    const req = {
      params: { postId },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCommentsForPost(req, res);

    // Expect a 500 response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});




