const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {

    },
    { timestamps: true }
);

const Post = mongoose.model('post', postSchema);

module.exports = Post;
