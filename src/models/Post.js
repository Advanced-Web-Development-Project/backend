const mongoose = require('mongoose');


const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        imagePath: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        dislikes: {
            type: Number,
            default: 0,
        },
        content: {
            type: String,
            required: true
        },

    },
    { timestamps: true }
);


const Post = mongoose.model('Post', postSchema);

module.exports = Post;

