const mongoose = require("mongoose");

/**
 * Marketpost Schema for User Post
 * Which contains the username,title,content,image,createdAt,year_of_purchase, address,
 * city, state, country
 */
const MarketpostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
      required: false,
    },
  ],
  createdAt: {
    type: Number,
    default: Date.now,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  year_of_purchase: {
    type: Number,
    default: Date.now,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Marketpost = mongoose.model("Marketpost", MarketpostSchema);

module.exports = Marketpost;
