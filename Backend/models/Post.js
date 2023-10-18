const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image:[{
        type: String,   
        required: false
    }],
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        default: Date.now,
        required: true
    }
});

// Create a Mongoose model based on the defined schema, named 'User'
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;