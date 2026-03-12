const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        //add picture functionality
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        username: {
            type: mongoose.Schema.Types.String,
            ref: "users",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        likeCount: {
            type: Number,
            default: 0
        },
        likedBy: {
            type:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }],
            default: []
        },
        savedBy: {
            type:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }],
            default: []
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
    },
    { collection: "posts" }
);

const Post = mongoose.model("posts", PostSchema);
Post.createIndexes();
module.exports = Post;
