const { userPost,retrievePosts,addCommentToPost,getCommentsForPost } = require('../userpost'); 
const User = require('../models/User');
const Post = require('../models/Post');

// Mocking the necessary dependencies
jest.mock('../models/User');
jest.mock('../models/Post');

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

// describe('retrievePosts', () => {
//   it('retrieves posts and sorts them by creation date in descending order', async () => {
//     const posts = [
//       { title: 'Post 1', createdAt: new Date('2023-10-25T10:00:00Z') },
//       { title: 'Post 2', createdAt: new Date('2023-10-26T10:00:00Z') },
//       { title: 'Post 3', createdAt: new Date('2023-10-24T10:00:00Z') },
//     ];
//     jest.spyOn(Post, 'find').mockResolvedValue(posts);
  
//     const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//     await retrievePosts(null, res);
  
//     expect(Post.find).toHaveBeenCalled();
//     expect(Post.find).toHaveBeenCalledWith();
//     expect(Post.find.sort).toHaveBeenCalledWith({ createdAt: 'desc' });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ posts });
//   });
// });



describe('addCommentToPost', () => {
  // it('should add a comment to a post', async () => {
  //   const postId = 'testPostId';
  //   const commentData = {
  //     username: 'testUser',
  //     content: 'This is a test comment',
  //     createdAt: 1697408297
  //   };

  //   // Mock the behavior of Post.findById and save
  //   const postMock = {
  //     _id: postId,
  //     comments: [],
  //     save: jest.fn(),
  //   };
  //   Post.findOne.mockResolvedValue(postMock);

  //   const req = {
  //     params: { postId },
  //     body: commentData,
  //   };

  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };

  //   await addCommentToPost(req, res);

  //   // Check if the comment is added to the post and response is as expected
  //   expect(postMock.comments).toHaveLength(1);
  //   expect(postMock.comments[0].username).toBe('testUser');
  //   expect(postMock.comments[0].content).toBe('This is a test comment');
  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: 'Comment added successfully',
  //     post: expect.any(Object), // You can further specify the expected data here.
  //   });
  // });

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
});

describe('getCommentsForPost', () => {
  // it('should retrieve comments for a post and sort them by creation date', async () => {
  //   const postId = 'testPostId';
  //   const postMock = {
  //     _id: postId,
  //     comments: [
  //       { username: 'user1', content: 'Comment 1', createdAt: new Date('2023-10-25T10:00:00Z') },
  //       { username: 'user2', content: 'Comment 2', createdAt: new Date('2023-10-24T10:00:00Z') },
  //       { username: 'user3', content: 'Comment 3', createdAt: new Date('2023-10-26T10:00:00Z') },
  //     ],
  //   };

  //   // Mock Post.findById to return the post with comments
  //   Post.findOne.mockResolvedValue(postMock);

  //   const req = {
  //     params: { postId },
  //   };

  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };

  //   await getCommentsForPost(req, res);

  //   // Ensure the comments are sorted by creation date
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     comments: expect.arrayContaining([
  //       expect.objectContaining({ username: 'user3', content: 'Comment 3' }),
  //       expect.objectContaining({ username: 'user1', content: 'Comment 1' }),
  //       expect.objectContaining({ username: 'user2', content: 'Comment 2' }),
  //     ]),
  //   });
  // });

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




