const User = require('./models/User');
const Marketpost = require('./models/Marketpost');
const Iterator = require('./Iterator');

/**
 * Function for market user posts
 */
async function marketcreatePost(req, res) {
    try {
        const { username, title, content, image,createdAt, year_of_purchase, address, city, state, country } = req.body;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Incomplete data. Please provide all required fields.' });
        }

        if(!isValidDate(createdAt)){
            return res.status(400).json({ error: 'Invalid data. Please provide valid data in fields.' });
        }

        const user = await User.findOne({
            username: username
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        const newMarketPost = new Marketpost({
            username,
            title,
            content,
            image,
            createdAt,
            year_of_purchase,
            address,
            city,
            state,
            country
        });

        await newMarketPost.save();

        res.status(201).json({ message: 'Market Post created successfully', newMarketPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Function to retrieve market posts and sort them by createdAt 
 */
async function retrieveMarketPosts(req, res) {
    try {
        // Find all market posts and sort by createdAt in descending order
        const marketPosts = await Marketpost.find().sort({ createdAt: 'desc' });

        const marketPostIterator = new Iterator(marketPosts);

        const result = [];
        let marketPost = marketPostIterator.next();
        while (!marketPost.done) {
            result.push(marketPost.value);
            console.log(marketPost);
            marketPost = marketPostIterator.next();
        }

        res.status(200).json({ marketPosts: result });

    } catch (error) {
        console.error('Error retrieving market posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Function to handle city filtering on users post
 */
async function filterMarketPosts(req, res) {
    try {
        const { city, state } = req.body;

         // If neither city nor state is provided, return a specific message
        if (!city && !state) {
            return res.status(200).json({ message: 'No posts found. Please provide city or state parameters.' });
        }

        let query = {};
    
        // Check if the city parameter is provided
        if (city) {
          // Use case-insensitive regex for partial matching
            query.city = new RegExp(city, 'i');
        }
    
        // Check if the state parameter is provided
        if (state) {
          // Use case-insensitive regex for partial matching
            query.state = new RegExp(state, 'i');
        }

      // Find market posts based on the query and sort by createdAt in descending order
        const marketPosts = await Marketpost.find(query).sort({ createdAt: 'desc' });

        const marketPostIterator = new Iterator(marketPosts);

    const result = [];
    let marketPost = marketPostIterator.next();
    while (!marketPost.done) {
        result.push(marketPost.value);
        marketPost = marketPostIterator.next();
    }

    if (result.length === 0) {
        return res.status(200).json({ message: 'No posts found on the provided criteria.' });
    }

    res.status(200).json({ marketPosts: result });

    } catch (error) {
        console.error('Error retrieving market posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

module.exports ={ marketcreatePost,
    retrieveMarketPosts,
    filterMarketPosts,
    };
