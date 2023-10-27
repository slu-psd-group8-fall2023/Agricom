const User = require('./models/User');
const Post = require('./models/Post');


/**
 * Function for user posts
 */
async function userPost(req, res) {
    try {
    const { username, title, content, image, createdAt } = req.body;
    
    const user = await User.findOne({
        username: username
    });

    if (!user) {
        return res.status(400).json({ error: 'User not found.' });
    }

    const newPost = new Post({
        username, title, content, image, createdAt
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', newPost });
    } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Function to retrieve posts  and sort them by createdAt 
 */
async function retrievePosts(req, res) {
    try {
        // Find all posts and sort by createdAt in descending order
        const posts = await Post.find().sort({ createdAt: 'desc' });

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Function to add a comment to a post
 */
async function addCommentToPost(req, res) {
    try {
      const { _id } = req.params; // Extract the post ID from the URL
      const { username, content, createdAt } = req.body;
  
      // Find the post by its ID
      const post = await Post.findOne(_id);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Add the comment to the post's comments array
      post.Comments.push({ username, content, createdAt });
  
      // Save the updated post with the new comment
      await post.save();
  
      res.status(201).json({ message: 'Comment added successfully', post });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

/**
 * Function to retrieve comments for a post and sort them by createdAt
 */
async function getCommentsForPost(req, res) {
    try {
      const { postId } = req.params; // Extract the post ID from the URL
  
      // Find the post by its ID
      const post = await Post.findOne(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Sort the comments by createdAt in descending order
      const sortedComments = post.Comments.sort((a, b) => a.createdAt - b.createdAt);
  
      res.status(200).json({ comments: sortedComments });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  

module.exports = {
    userPost,
    retrievePosts,
    addCommentToPost,
    getCommentsForPost,
};