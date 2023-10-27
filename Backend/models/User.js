const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token:{
        type: String,
        required: false
    },
    tokenexpire:{
        type: String,
        required: false
    }
});

// Create a Mongoose model based on the defined schema, named 'User'
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;