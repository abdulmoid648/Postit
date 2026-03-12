import { useContext, useEffect, useState } from "react";
import { UserContext } from "./../../contexts/UserState";
import { Link, useParams } from "react-router-dom";
import { Delete, Trash, Trash2, TrashIcon, UserMinus, UserPlus } from "lucide-react";
import { Postcard } from "../Postcard/Postcard";

const ProfilePage = () => {
    const { userId } = useParams();
    const { currentUser, fetchProfile, fetchUserPosts, authToken } = useContext(UserContext);
    const [userData, setUserData] = useState("user not found");
    const [userPosts, setUserPosts] = useState([]);
    const isCurrentUser = currentUser.id === userId;
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const URL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            const userData = await fetchProfile(userId);
            setUserData(userData);

            if (userData && Array.isArray(userData.followersList)) {
                checkFollowed(userData);
                checkFollowersCount(userData);
            }
        };

        const fetchPosts = async () => {
            const userPosts = await fetchUserPosts(userId);
            setUserPosts(userPosts.reverse());
        };

        fetchData();
        fetchPosts();
    }, [userId]);

    const checkFollowed = (userData) => {
        const isFollowing = userData.followersList.includes(currentUser.id);
        setIsFollowing(isFollowing);
    };

    const checkFollowersCount = (userData) => {
        const followersCount = userData.followersCount;
        setFollowersCount(followersCount);
    };

    const handleFollowClick = async (profileId) => {
        const response = await fetch(`${URL}/api/user/toggle-follow/${profileId}`, {
            method: "PUT",
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentUserId: currentUser.id }),
        });
        const result = await response.json();
        if (result.message === "Followed successfully") {
            setFollowersCount(followersCount + 1);
            setIsFollowing(true);
        } else if (result.message === "Unfollowed successfully") {
            setFollowersCount(followersCount - 1);
            setIsFollowing(false);
        } else {
            console.log("something else");
        }
    };

    const handleDeletePost = async (postId) => {
        const response = await fetch(`${URL}/api/post/deletepost/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentUserId: currentUser.id }),
        });

        const result = await response.json();
        if (result.message === "Post deleted successfully") {
            setUserPosts(userPosts.filter((post) => post._id !== postId));
        } else {
            console.log("Error deleting post");
        }
    };

    return (
        <div className="text-gray-300 w-full h-full flex flex-col items-center justify-center">
            <div className="w-100">
            <div className=" flex items-center space-x-6 w-full pt-10 pb-5">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                    alt="User Avatar"
                    className="w-35 aspect-square rounded-full border-2 border-gray-600"
                />
                <div>
                    <h2 className="text-xl font-semibold text-gray-200">{userData.username}</h2>
                    <p className="text-sm text-gray-400">{userData.bio}</p>
                    <p className="text-sm text-gray-400">{userData.id}</p>
                    <div className="flex space-x-4  text-gray-400 mt-2">
                        <span className="flex flex-col">{userData.postsCount} Posts</span>
                        <span className="flex flex-col">{followersCount} Followers</span>
                        <span className="flex flex-col">{userData.followingCount} Following</span>
                    </div>
                    {isCurrentUser ? (
                        <Link className="mt-2 bg-gray-700 px-4 py-1 rounded-lg text-sm">
                            Edit Profile
                        </Link>
                    ) : (
                        <button
                            className={`px-2 py-1 mt-3 rounded-lg text-md flex justify-center items-center ${isFollowing ? "bg-red-600" : "bg-blue-600"}`}
                            onClick={() => handleFollowClick(userData._id)}
                        >
                            {isFollowing ? 
                            <>
                                <p>Unfollow</p>
                                <UserMinus className="text-lg"/>
                            </>
                            : 
                            <>
                                <p>Follow</p>
                                <UserPlus className="text-lg"/>
                            </>
                            }
                        </button>
                    )}
                </div>
            </div>

            {currentUser !== null && userPosts.length === 0 ? (
                <div className="text-gray-300 w-full h-full flex flex-col items-center">
                    <h1 className="text-left w-100 text-4xl font-bold px-2 pt-5 bg-slate-900">User Posts</h1>

                    <div className="flex justify-center items-center w-100 h-180">
                        <p className="text-left text-slate-600 w-100 text-lg px-2">No posts to view</p>
                    </div>
                </div>
            ) : (
                <div className="text-gray-300 w-full h-full flex flex-col items-center">
                    <h1 className="text-left w-100 text-4xl font-bold px-2 pt-5 bg-slate-900">User Posts</h1>

                    {userPosts.map((post, index) => {
                        return (
                            <div key={index} className="relative w-full flex flex-col items-center">
                                <Postcard
                                    key={index}
                                    postId={post._id}
                                    text={post.text}
                                    postedBy={post.postedBy}
                                    username={post.username}
                                    likeCount={post.likeCount}
                                    likedBy={post.likedBy}
                                    postTime={post.timestamp}
                                />
                                {isCurrentUser && (
                                    <button
                                        className="cursor-pointer absolute top-2 right-2 bg-red-500 px-4 mt-2 py-1 rounded-lg text-sm z-10"
                                        onClick={() => handleDeletePost(post._id)}
                                    >
                                        <Trash2/>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            </div>
        </div>
    );
};

export default ProfilePage;
