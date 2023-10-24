const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
username:{
    type: String,
    required: true
},
title:{
    type: String,
    required: true
},
content:{
    type: String,   
    required: true
},
image:[{
    type: String,   
    required: false
}],
createdAt:{
    type: Number,
    default: Date.now,  
    required: true
}
});

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;