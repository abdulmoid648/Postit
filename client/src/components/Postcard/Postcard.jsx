import { useContext, useState } from "react";
import { Bookmark, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { UserContext } from "./../../contexts/UserState";
import { Link } from "react-router-dom";

const URL = "";

export const Postcard = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const userContext = useContext(UserContext);
    const { authToken, currentUser } = userContext;

    // Store Like Count and Liked State in State
    const [likeCount, setLikeCount] = useState(props.likeCount);
    const [isLiked, setIsLiked] = useState(props.likedBy.includes(currentUser.id));

    const fullText = props.text;
    const truncatedText = fullText.slice(0, 150) + "...";

    const handleLikeClick = async () => {
        try {
            const response = await fetch(`${URL}/api/post/like/${props.postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
                body: JSON.stringify({ currentUserId: currentUser.id }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setIsLiked(!isLiked);
            setLikeCount(data.post.likeCount);

        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    const getTimeAgo = (timestamp) => {
        const postDate = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - postDate) / 1000);
    
        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "week", seconds: 604800 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 }
        ];
    
        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
            }
        }
    
        return "just now";
    };

    return (
        <div className="w-100 rounded-lg overflow-hidden shadow-lg bg-gray-800 border-1 border-gray-700 my-2">
            <div className="px-6 pt-4 flex items-center">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                    alt="Author avatar"
                    className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                    <Link to={`/userprofile/${props.postedBy}`} className="text-sm font-semibold text-gray-200">{props.username}</Link>
                    <p className="text-xs text-gray-600">{getTimeAgo(props.postTime)}</p>
                </div>
            </div>
            <div className="px-2 py-2">
                <p className="text-gray-200 text-sm text-wrap m-2">{fullText.length > 150 ? (isExpanded ? fullText : truncatedText) : fullText}</p>
                {fullText.length > 150 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-500 active:text-blue-600 text-sm mt-2 flex items-center"
                    >
                        {isExpanded ? (
                            <>
                                Show less <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                        ) : (
                            <>
                                Read more <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </button>
                )}
            </div>
            {/* <img
                src="https://cdna.artstation.com/p/assets/images/images/008/358/372/large/emily-ritchie-pika-pngl.jpg?1512240328"
                alt="Post image"
                className="w-96 rounded-lg mx-2"
            /> */}

            {/* Like Button with Color Change */}
            <div className="px-6 py-4 flex justify-between border-gray-200">
                <button
                    className="group flex items-center text-gray-500"
                    onClick={handleLikeClick}
                >
                    <Heart
                        className={`mr-2 ${isLiked ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
                    />
                    <span className="ml-2 text-sm">{likeCount}</span>
                </button>

                {/* <button className="group flex items-center text-gray-500 active:text-green-400">
                    <span className="text-sm">Share</span>
                    <Bookmark className="ml-2 fill-none group-active:fill-green-400 group-active:stroke-none" />
                </button> */}
            </div>
        </div>
    );
};
