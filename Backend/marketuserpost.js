const User = require('./models/User');
const Marketpost = require('./models/Marketpost');

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
