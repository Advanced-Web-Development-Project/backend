const { ObjectId } = require('bson');
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
            type: [String],
            default: [],
        },
        dislikes: {
            type: [String],
            default: [],
        },
        content: {
            type: String,
            required: true
        },

    },
    { timestamps: true, autoIndex: false }
);


const Post = mongoose.model('Post', postSchema);

module.exports = Post;

