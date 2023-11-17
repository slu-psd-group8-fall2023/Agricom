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
            return res.status(400).json({ error: 'Invalid date. Please provide valid data in fields.' });
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


function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

module.exports ={ 
    marketcreatePost,
    };
