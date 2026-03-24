import React, { useState, createContext, useEffect } from "react";
const URL = ""

export const UserContext = createContext();

const UserState = (props) => {

    const getStoredValue = (key, defaultValue) => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    };

    const [currentUser, setCurrentUser] = useState(() => getStoredValue("currentUser", null));
    const [authToken, setAuthToken] = useState(() => getStoredValue("authToken", "tokennotfound"));
    const [followingPosts, setFollowingPosts] = useState(() => getStoredValue("followingposts", []));

    useEffect(() => {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("authToken", JSON.stringify(authToken));
    }, [authToken]);

    useEffect(()=>{
        if(currentUser !== null){
            fetchFollowingPosts(currentUser.id)
        }
    },[])

    //SEND FETCH FOLLOWING POSTS REQUEST
    const fetchFollowingPosts = async (userId) => {
        try {
            const response = await fetch(`${URL}/api/post/fetchFollowingUsersPosts/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: authToken,
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) throw new Error("Failed to fetch posts");
    
            const data = await response.json();
            const allPosts = data.posts;
            setFollowingPosts(allPosts)
        } catch (error) {
            console.log("Error fetching following posts:");
        }
    };

    //FETCH USER POSTS BY USERNAME
    const fetchUserPosts = async (userId) => {
        const response = await fetch(`${URL}/api/post/fetchUserAllPosts/${userId}`,{
            method: "GET",
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
        })
        const posts = await response.json()
        if(!posts){
            return ("no post found")
        }else{
            return posts
        }
    }

    //FETCH PROFILE BY USERNAME
    const fetchProfile = async (userId) => {
        const response = await fetch(`${URL}/api/user/fetchUserProfile/${userId}`,{
            method: "GET",
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if(!data){
            return ("user not found")
        }else{
            const userData = data.userFound;
            return userData
        }
    }

    const fetchExplorePagePosts = async() => {
        const response = await fetch(`${URL}/api/post/fetchAllPublicUsersPosts`,{
            method: "GET",
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
        })
        const posts = await response.json()
        if(!posts){
            return ("posts not found")
        }else{
            return posts
        }
    }

    //SEND LOGIN USER REQUEST
    const userLogin = async (email, password) => {
        const response = await fetch(`${URL}/api/user/userLogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        })
        const user = await response.json();
        if (user.errors) {
            alert("errors: " + user.errors[0].msg)
        } else if (user.errorOccured) {
            alert("error: " + user.errorOccured)
        } else {
            await setCurrentUser({ username: user.username, id: user.id })
            await setAuthToken(user.authToken)
            alert("login successful")
        }
    }

    return (
        <UserContext.Provider value={{ authToken, setAuthToken, currentUser, setCurrentUser, userLogin, fetchFollowingPosts,followingPosts, setFollowingPosts, fetchProfile, fetchUserPosts , fetchExplorePagePosts}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState