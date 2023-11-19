const User = require('./models/User');
const Marketpost = require('./models/Marketpost');
const Iterator = require('./Iterator');

/**
 * Function for market user posts
 */
async function marketcreatePost(req, res) {
    try {
        // Destructuring the required fields from the request body
        const { username, title, content, image, createdAt, year_of_purchase, address, city, state, country } = req.body;

        // Checking the individual fields 
        if (!isValidData({ username, title, content, createdAt, year_of_purchase, address, city, state, country })) {
            return res.status(400).json({ error: 'Invalid data. Please provide valid data in fields.' });
        }

        // Validate the format of the provided date
        if (!isValidDate(createdAt)) {
            return res.status(400).json({ error: 'Invalid date. Please provide a valid date in the createdAt field.' });
        }

        // Find the user in the database based on the provided username
        const user = await User.findOne({
            username
        });

        // Check if the user exists
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        // Create a new market post instance with the provided data
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

        // Save the new market post to the database
        await newMarketPost.save();

        res.status(201).json({ message: 'Market Post created successfully', newMarketPost });
    } catch (error) {
        // Log any errors that occur during the process
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


/**
 * Function to retrieve market posts and sort them by createdAt 
 */
async function retrieveMarketPosts(req, res) {
    try {
        // Retrieve all market posts from the database
        const marketPosts = await Marketpost.find();

        // Sort the market posts by createdAt date in descending order
        marketPosts.sort({ createdAt: 'desc' });

        // Create an iterator for the market posts array
        const marketPostIterator = new Iterator(marketPosts);

        const result = [];

        // Iterate through the market posts using the custom iterator
        let marketPost = marketPostIterator.next();
        while (!marketPost.done) {
            // Push the current market post to the result array
            result.push(marketPost.value);
            marketPost = marketPostIterator.next();
        }

        // Respond with a 200 OK status and the sorted market posts
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

       // Find market posts based on the query
       let marketPosts = await Marketpost.find(query);

       // Check if any sorting is needed
       if (marketPosts && marketPosts.sort) {
           // Sort by createdAt in descending order
           marketPosts = marketPosts.sort((a, b) => b.createdAt - a.createdAt);
       }

       if (marketPosts.length === 0) {
        return res.status(200).json({ message: 'No posts found on the provided criteria.' });
    }

        const marketPostIterator = new Iterator(marketPosts);

    const result = [];
    let marketPost = marketPostIterator.next();
    while (!marketPost.done) {
        result.push(marketPost.value);
        marketPost = marketPostIterator.next();
    }

    res.status(200).json({ marketPosts: result });

    } catch (error) {
        console.error('Error retrieving market posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to check if a given date string is a valid date
function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

// Function to check if a given date string is a valid data
function isValidData(data) {
    return Object.values(data).every(value => value !== undefined && value !== '');
}


module.exports ={ 
    marketcreatePost,
    retrieveMarketPosts,
    };