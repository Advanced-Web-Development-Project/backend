const { ObjectId } = require('bson');
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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

// postSchema.methods.toJSON = function () {

//     const postObject = this.toObject();

//     // The timestamps are stored in UTC in the database, but we want to display them in the user's local timezone
//     postObject.createdAt = moment(this.createdAt).tz('Asia/Jerusalem').format();
//     postObject.updatedAt = moment(this.updatedAt).tz('Asia/Jerusalem').format();

//     return {
//         id: postObject._id,
//         user: postObject.user,
//         title: postObject.title,
//         imagePath: postObject.imagePath,
//         likes: postObject.likes,
//         content: postObject.content,
//         createdAt: postObject.createdAt,
//         updatedAt: postObject.updatedAt,
//     };
// }

module.exports = Post;

