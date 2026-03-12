import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserState';
import { Postcard } from '../Postcard/Postcard';


const Explorepage = () => {

    const userContext = useContext(UserContext)
    const { currentUser, fetchExplorePagePosts } = userContext;
    const [explorePagePosts, setExplorePagePosts] = useState([]);
    const [post, setPost] = useState({})

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser === null) {
            navigate("/login")
        }
    }, [currentUser])

    useEffect(() => {
        const fetchPublicPosts = async () => {
            const posts = await fetchExplorePagePosts();
            console.log(posts);
            setExplorePagePosts(posts.reverse());
        }
        fetchPublicPosts();
    }, [])

    return (
        <>
            {currentUser !== null &&
                explorePagePosts.length === 0 ?
                <div className="text-gray-300 w-full h-full flex flex-col items-center">
                    <h1 className="text-left w-100 text-4xl font-bold px-2 pt-5 bg-slate-900">Explore</h1>
                    <div className="flex justify-center items-center w-100 h-180">
                        <p className="text-left text-slate-600 w-100 text-lg px-2">No posts to view</p>
                    </div>
                </div>
                :
                <div className="text-gray-300 w-full h-full flex flex-col items-center">
                    <h1 className="text-left w-100 text-4xl font-bold px-2 pt-5 bg-slate-900">Explore</h1>
                    {explorePagePosts.map((post, index) => {
                        return (
                            <Postcard key={index} postId={post._id} text={post.text} postedBy={post.postedBy} username={post.username} likeCount={post.likeCount} likedBy={post.likedBy} postTime={post.timestamp} />
                        )
                    })}
                </div>
            }
        </>
    )
}

export default Explorepage