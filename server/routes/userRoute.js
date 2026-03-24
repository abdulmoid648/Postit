const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/UserSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AuthorizeUser } = require("../middleware/userAuth.js");
const SECRET_KEY = process.env.SECRET_KEY;


//LOGIN USER + Authorization check
router.post(
	"/userLogin",
	[
		body("email", "Enter a valid email").isEmail(),
		body("password", "Password must be at least 8 characters").isLength({
			min: 8,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(401).json({ errors: errors.array() });
		} else {
			let userFound = await User.findOne({ email: req.body.email });
			if (!userFound) {
				return res.status(404).json({ errorOccured: "user not found" });
			} else {
				const enteredPassword = await bcrypt.compare(
					req.body.password,
					userFound.password
				);
				if (!enteredPassword) {
					return res.status(401).json({
						errorOccured: "password didn't match. try again",
					});
				} else {
					const payload = {
						userId: userFound._id,
					};
					let authToken = await jwt.sign(payload, SECRET_KEY);
					return res.status(200).json({
						result: "login successful",
						username: userFound.username,
						id: userFound._id,
						authToken: authToken,
					});
				}
			}
		}
	}
);

//USER SIGNUP + Authorization check
router.post(
	"/userSignup",
	[
		body("username", "Username must be at least 3 characters").isLength({
			min: 3,
		}),
		body(
			"displayName",
			"Display name must be at least 3 characters"
		).isLength({ min: 3 }),
		body("email", "Enter a valid email").isEmail(),
		body("password", "Password must be at least 8 characters").isLength({
			min: 8,
		}),
		body("bio", "Please enter a bio").isLength({ min: 1 }),
		body("accountType", "Please choose account type").isIn([
			"public",
			"private",
		]),
		//add picture functionality
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(401).json({ errors: errors.array() });
		} else {
			let userFound = await User.findOne({
				$or: [
					{ email: req.body.email },
					{ username: req.body.username },
				],
			});
			if (userFound) {
				return res
					.status(401)
					.json({ error: "this username or email already exists" });
			} else {
				let salt = await bcrypt.genSalt(10);
				const encryptedPass = await bcrypt.hash(
					req.body.password,
					salt
				);
				let userCreated = await User.create({
					displayName: req.body.displayName,
					username: req.body.username,
					email: req.body.email,
					password: encryptedPass,
					bio: req.body.bio,
					accountType: req.body.accountType,
				});
				const payload = {
					userId: userCreated._id,
				};
				let authToken = await jwt.sign(payload, SECRET_KEY);
				return res.status(200).json({
					result: "signup successful",
					authToken: authToken,
				});
			}
		}
	}
);

//FETCH PROFILE BY USERNAME + Authorization check
router.get("/fetchUserProfile/:userId", AuthorizeUser, async(req,res)=>{
	try{
		const userFound = await User.findById(req.params.userId)

		if(!userFound){
			return res.status(404).json({ error: "User not found" });
		}else{
			return res.status(200).json({userFound: userFound})
		}

	}catch(error){
		return res.status(500).json({ error: "Internal Server Error" });
	}
})

//FOLLOW UNFOLLOW + Authotization check
router.put("/toggle-follow/:id", AuthorizeUser, async (req, res) => {
	const currentUserId = req.body.currentUserId;
	const otherUserId = req.params.id;

	if (currentUserId == otherUserId) {
		return res.status(401).json({ errorOccured: "You can't follow/unfollow your own account" });
	}

	try {
		const loggedInUser = await User.findById(currentUserId);
		const otherUser = await User.findById(otherUserId);

		if (!loggedInUser || !otherUser) {
			return res.status(404).json({ error: "User not found" });
		}

		const isFollowing = loggedInUser.followingList.includes(otherUserId);
		let updateCurrentUser, updateOtherUser, message;

		if (isFollowing) {
			// Unfollow user
			updateCurrentUser = await User.findByIdAndUpdate(
				currentUserId,
				{
					$pull: { followingList: otherUserId },
					$inc: { followingCount: -1 },
				},
				{ new: true }
			);

			updateOtherUser = await User.findByIdAndUpdate(
				otherUserId,
				{
					$pull: { followersList: currentUserId },
					$inc: { followersCount: -1 },
				},
				{ new: true }
			);
			message = "Unfollowed successfully";
		} else {
			// Follow user
			updateCurrentUser = await User.findByIdAndUpdate(
				currentUserId,
				{
					$push: { followingList: otherUserId },
					$inc: { followingCount: 1 },
				},
				{ new: true }
			);

			updateOtherUser = await User.findByIdAndUpdate(
				otherUserId,
				{
					$push: { followersList: currentUserId },
					$inc: { followersCount: 1 },
				},
				{ new: true }
			);
			message = "Followed successfully";
		}

		if (!updateCurrentUser || !updateOtherUser) {
			return res.status(500).json({ error: "Failed to update follow status" });
		}

		return res.status(200).json({ message, updatedUser: updateCurrentUser });

	} catch (error) {
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

// Fetch top creators
router.get("/top-creators", AuthorizeUser, async (req, res) => {
    try {
        const topCreators = await User.find({ topCreator: true });
        return res.status(200).json(topCreators);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// EDIT PROFILE ROUTE
router.put(
    "/edit-profile",
    AuthorizeUser,
    [
        body("username", "Username must be at least 3 characters").isLength({ min: 3 }),
        body("email", "Invalid email").isEmail(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, bio, profilePicture } = req.body; // Get new data from the request body

        try {
            const currentUser = await User.findById(req.user.id); // Get the current user from the auth token

            if (!currentUser) {
                return res.status(404).json({ error: "User not found" });
            }

            // Check if the username or email is already taken by another user
            const usernameExists = await User.findOne({ username: username });
            const emailExists = await User.findOne({ email: email });

            if (usernameExists && usernameExists._id.toString() !== currentUser._id.toString()) {
                return res.status(400).json({ error: "Username is already taken" });
            }

            if (emailExists && emailExists._id.toString() !== currentUser._id.toString()) {
                return res.status(400).json({ error: "Email is already taken" });
            }

            // Update user data
            currentUser.username = username || currentUser.username;
            currentUser.email = email || currentUser.email;
            currentUser.bio = bio || currentUser.bio;
            currentUser.profilePicture = profilePicture || currentUser.profilePicture; // Update profile picture if available

            const updatedUser = await currentUser.save(); // Save the updated data

            res.status(200).json({
                message: "Profile updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

//SEARCH USER
router.get("/search", AuthorizeUser, async (req, res) => {
    const query = req.query.query?.trim(); // Get the query parameter from the request

    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        // Search users by username or display name (case-insensitive search)
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { displayName: { $regex: query, $options: "i" } },
            ],
        }).limit(10); // Limit results to the first 10 matches

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});




module.exports = router;
