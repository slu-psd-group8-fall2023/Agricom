const User = require("./models/User");
const Post = require("./models/Post");
const Iterator = require("./Iterator");

/**
 * Function for user posts
 */
async function userPost(req, res) {
  try {
    const { username, title, content, image, createdAt } = req.body;

    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    const newPost = new Post({
      username,
      title,
      content,
      image,
      createdAt,
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Function to retrieve posts  and sort them by createdAt
 */
async function retrievePosts(req, res) {
  try {

    const { username } = req.body;

    let query = {};

    if (username) {
      query = { username };
    }
    // Find all posts and sort by createdAt in descending order
    const posts = await Post.find(query).sort({ createdAt: -1 });

    const postIterator = new Iterator(posts);

    const result = [];
    let post = postIterator.next();
    while (!post.done) {
      result.push(post.value);
      post = postIterator.next();
    }

    res.status(200).json({ posts: result });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Function to add a comment to a post
 */
async function addCommentToPost(req, res) {
  try {
    const { postId } = req.params; // Extract the post ID from the URL
    const { username, content, createdAt } = req.body;

    // Find the post by its ID
    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure that the post has a 'Comments' array
    if (!post.Comments) {
      post.Comments = [];
    }

    // Add the comment to the post's comments array
    post.Comments.push({ username, content, createdAt });

    // Save the updated post with the new comment
    await post.save();

    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Function to retrieve comments for a post and sort them by createdAt
 */
async function getCommentsForPost(req, res) {
  try {
    const { postId } = req.params; // Extract the post ID from the URL

    // Find the post by its ID
    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Sort the comments by createdAt in descending order
    const sortedComments = post.Comments.sort(
      (a, b) => a.createdAt - b.createdAt
    );
    const commentsIterator = new Iterator(sortedComments);

    const result = [];
    let comment = commentsIterator.next();
    while (!comment.done) {
      result.push(comment.value);
      comment = commentsIterator.next();
    }

    res.status(200).json({ comments: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Function to handle delete users post
 */
async function deleteUserPost(req, res) {
  try {
    const { username, postId } = req.body;

    // Check if postId is provided
    if (!postId) {
      return res.status(400).json({ error: "postId parameter is required." });
    }

    // Find the user post by postId
    const marketPost = await Post.findById(postId);

    // Check if the user post exists
    if (!marketPost) {
      return res.status(404).json({ error: "User post not found." });
    }

    if (marketPost.username.toLowerCase() !== username.toLowerCase()) {
      return res
        .status(403)
        .json({ error: "Unauthorized. You do not own this post." });
    }

    // Delete the user post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "User post deleted successfully." });
  } catch (error) {
    console.error("Error deleting user post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  userPost,
  retrievePosts,
  addCommentToPost,
  getCommentsForPost,
  deleteUserPost,
};
