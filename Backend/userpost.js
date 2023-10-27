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
        const posts = await Post.find().sort({ createdAt: -1 });

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    userPost,
    retrievePosts,
};