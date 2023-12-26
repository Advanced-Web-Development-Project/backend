const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    text: { type: String, required: true },
    likes: {
        type: Map,
        of: Boolean,
        default: {},
    },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            username: { type: String, required: true },
            text: { type: String, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
        },
    ],
    // other post properties
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
