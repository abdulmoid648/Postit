const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Post = require("../models/PostSchema.js");
const User = require("../models/UserSchema.js");
const { AuthorizeUser } = require("../middleware/userAuth.js");

//USER POSTS FOR PROFILE PAGE
router.get("/fetchUserAllPosts/:userId", AuthorizeUser, async (req, res) => {
	try {
		const userPosts = await Post.find({ postedBy: req.params.userId });
		return res.json(userPosts.flat());
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

//GET POSTS OF FOLLOWING USER (FEED POSTS)
router.get(
	"/fetchFollowingUsersPosts/:userId",
	AuthorizeUser,
	async (req, res) => {
		try {
			const loggedInUser = await User.findById(req.params.userId)
				.select("followingList")
				.lean();

			if (!loggedInUser) {
				return res.status(404).json({ error: "User not found" });
			}

			const followingList = loggedInUser.followingList.map((id) =>
				id.toString()
			);
			const authToken = req.headers.authorization;

			const followingUserPosts = await Promise.all(
				followingList.map(async (userId) => {
					const response = await fetch(
						`http://localhost:5000/api/post/fetchUserAllPosts/${userId}`,
						{
							method: "GET",
							headers: { Authorization: authToken },
						}
					);

					if (!response.ok)
						throw new Error(
							`Failed to fetch posts for user ${userId}`
						);

					const data = await response.json();
					return data;
				})
			);

			const allPosts = followingUserPosts.flat();
			return res.status(200).json({ posts: allPosts });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
);

//LIKE POST
router.put("/like/:postId", AuthorizeUser, async (req, res) => {
	const currentUserId = req.body.currentUserId;
	const postId = req.params.postId;

	if (!currentUserId) {
		return res.status(401).json({ error: "User ID is required" });
	}

	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Convert likedBy array to string format (if it contains ObjectIds)
		const likedByUserIds = post.likedBy.map((id) => id.toString());

		let updateQuery;
		let message;

		if (likedByUserIds.includes(currentUserId.toString())) {
			// User already liked the post → unlike it
			updateQuery = {
				$pull: { likedBy: currentUserId },
				$inc: { likeCount: -1 },
			};
			message = "Post unliked successfully";
		} else {
			// User has not liked the post → like it
			updateQuery = {
				$push: { likedBy: currentUserId },
				$inc: { likeCount: 1 },
			};
			message = "Post liked successfully";
		}

		const updatedPost = await Post.findByIdAndUpdate(postId, updateQuery, {
			new: true,
		});

		if (!updatedPost) {
			return res.status(500).json({ error: "Failed to update the post" });
		}

		return res.status(200).json({ message, post: updatedPost });
	} catch (error) {
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

//PUBLIC POSTS FOR EXPLORE PAGE
router.get("/fetchAllPublicUsersPosts", AuthorizeUser, async (req, res) => {
	try {
		const publicUsers = await User.find({ accountType: "public" }, "_id");
		const publicUserIds = publicUsers.map((user) => user._id);
		const publicPosts = await Post.find({
			postedBy: { $in: publicUserIds },
		});
		return res.json(publicPosts);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

//CREATE POST BY LOGGEDIN USER
router.post(
	"/createpost",
	AuthorizeUser,
	[
		body("postedBy", "User ID is not valid").isLength({ min: 3 }),
		body("text", "Caption must be at least 3 characters").isLength({
			min: 3,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const username = req.body.username;
			const userId = req.body.postedBy;

			if (!username || !userId) {
				return res
					.status(401)
					.json({ error: "User ID and username is required" });
			}

			const userFound = await User.findById(userId);

			if (!userFound) {
				return res.status(404).json({ error: "User not found" });
			} else {
				if (userFound.username != username) {
					return res
						.status(401)
						.json({
							error: "user id does not match with this username",
						});
				}
			}

			let postCreated = await Post.create({
				postedBy: req.body.postedBy,
				username: req.body.username,
				text: req.body.text,
			});

			let updateUser = await User.findOneAndUpdate(
				{ username: req.body.username },
				{
					$push: { posts: postCreated._id },
					$inc: { postsCount: 1 },
				},
				{ new: true }
			);

			if (!updateUser) {
				return res.status(401).json({ error: "User not updated" });
			}
			if (!postCreated) {
				return res.status(401).json({ error: "post not created" });
			}

			res.status(201).json({
				message: "Post created successfully",
				post: postCreated,
				user: updateUser,
			});
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

// DELETE POST BY LOGGEDIN USER
router.delete("/deletepost/:postId", AuthorizeUser, async (req, res) => {
    const postId = req.params.postId;
    const currentUserId = req.body.currentUserId;
    
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.postedBy.toString() !== currentUserId) {
            return res.status(403).json({ error: "You cannot delete this post" });
        }

        await post.deleteOne({_id: postId});

        await User.findByIdAndUpdate(post.postedBy, {
            $pull: { posts: postId },
            $inc: { postsCount: -1 },
        });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
