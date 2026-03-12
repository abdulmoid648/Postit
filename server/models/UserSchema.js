const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
        //add picture functionality
		username: {
			type: String,
			required: true,
			unique: true,
		},
		displayName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			default: "",
		},
		followersCount: {
			type: Number,
			default: 0,
		},
		followingCount: {
			type: Number,
			default: 0,
		},
		followersList: {
			type:[{
				type: mongoose.Schema.Types.ObjectId,
				ref: "users"
			}],
			default: []
		},
		followingList: {
			type:[{
				type: mongoose.Schema.Types.ObjectId,
				ref: "users"
			}],
			default: []
		},
		postsCount: {
			type: Number,
			default: 0,
		},
		accountType: {
			type: String,
			enum: ["public", "private"],
			default: "private",
		},
		topCreator: {
			type: Boolean,
			default: false,
		},
		posts:{
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "posts",
				},
			],
			default: [],
		},
		savedPosts: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "posts",
				},
			],
			default: [],
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: "users" }
);


const User = mongoose.model("users", UserSchema);
User.createIndexes();
module.exports = User;
