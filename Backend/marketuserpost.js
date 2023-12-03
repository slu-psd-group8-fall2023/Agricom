const User = require("./models/User");
const Marketpost = require("./models/Marketpost");
const Iterator = require("./Iterator");

/**
 * Function for market user posts
 */
async function marketcreatePost(req, res) {
  try {
    // Destructuring the required fields from the request body
    const {
      username,
      title,
      content,
      image,
      createdAt,
      contact,
      year_of_purchase,
      address,
      city,
      state,
      country,
    } = req.body;

    // Checking the individual fields
    if (
      !isValidData({
        username,
        title,
        content,
        createdAt,
        contact,
        year_of_purchase,
        address,
        city,
        state,
        country,
      })
    ) {
      return res
        .status(400)
        .json({ error: "Invalid data. Please provide valid data in fields." });
    }

    if (!isValidPhoneNumber(contact)) {
      return res.status(400).json({
        error: "Invalid data. Please provide 10 digits in the contact field.",
      });
    }

    // Validate the format of the provided date
    if (!isValidDate(createdAt)) {
      return res.status(400).json({
        error:
          "Invalid date. Please provide a valid date in the createdAt field.",
      });
    }

    // Find the user in the database based on the provided username
    const user = await User.findOne({
      username,
    });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Create a new market post instance with the provided data
    const newMarketPost = new Marketpost({
      username,
      title,
      content,
      image,
      createdAt,
      contact,
      year_of_purchase,
      address,
      city,
      state,
      country,
    });

    // Save the new market post to the database
    await newMarketPost.save();

    res
      .status(201)
      .json({ message: "Market Post created successfully", newMarketPost });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Function to retrieve market posts and sort them by createdAt
 */
async function retrieveMarketPosts(req, res) {
  try {
    const { username } = req.body;

    // Check if the user exists
    if (
      !(await User.findOne({
        username,
      }))
    ) {
      return res.status(400).json({ error: "User not found." });
    }

    let query = {};

    if (username) {
      query = { username: username.toLowerCase() };
    }
    // Retrieve all market posts from the database
    const marketPosts = await Marketpost.find(query).sort({ createdAt: -1 });

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
    console.error("Error retrieving market posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Function to handle city filtering on users post
 */
async function filterMarketPosts(req, res) {
  try {
    const { city, state, country } = req.body;

    // If neither city nor state is provided, return a specific message
    if (!city && !state && !country) {
      return res.status(200).json({
        message:
          "No posts found. Please provide city, state, or country parameters.",
      });
    }

    let query = {};

    query.city = { $regex: new RegExp(city, "i") };
    query.state = { $regex: new RegExp(state, "i") };
    query.country = { $regex: new RegExp(country, "i") };

    // Find market posts based on the query
    let marketPosts = await Marketpost.find(query);

    // Check if any sorting is needed
    if (marketPosts && marketPosts.sort) {
      // Sort by createdAt in descending order
      marketPosts = marketPosts.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (marketPosts.length === 0) {
      return res
        .status(200)
        .json({ message: "No posts found on the provided criteria." });
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
    console.error("Error retrieving market posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Function to handle delete users post
 */
async function deleteMarketPost(req, res) {
  try {
    const { username, postId } = req.body;

    // Check if postId is provided
    if (!postId) {
      return res.status(400).json({ error: "postId parameter is required." });
    }

    // Find the user post by postId
    const marketPost = await Marketpost.findById(postId);

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
    await Marketpost.findByIdAndDelete(postId);

    res.status(200).json({ message: "User post deleted successfully." });
  } catch (error) {
    console.error("Error deleting user post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to check if a given date string is a valid date
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Function to check if a given date string is a valid data
function isValidData(data) {
  return Object.values(data).every(
    (value) => value !== undefined && value !== ""
  );
}

// Function to check if a given contact is a valid data or not
function isValidPhoneNumber(contact) {
  const numericPhoneNumber = String(contact).replace(/\D/g, "");
  return numericPhoneNumber.length === 10;
}

module.exports = {
  marketcreatePost,
  retrieveMarketPosts,
  filterMarketPosts,
  deleteMarketPost,
};
