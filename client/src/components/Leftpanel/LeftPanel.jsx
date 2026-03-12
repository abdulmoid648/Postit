import React, { useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from '../../contexts/UserState';


export const LeftPanel = () => {
    const userContext = useContext(UserContext)
    const { currentUser, setCurrentUser, setAuthToken } = userContext;

    const navigate = useNavigate();

    const handleLogout = () => {
        setCurrentUser(null)
        setAuthToken("tokennotfound")
        navigate("/login");
    }

    return (
        <>
            {currentUser !== null &&
                <div className="hidden md:flex fixed text-gray-200 w-80 h-screen border-r-1 border-gray-700 flex-col bg-gray-800 justify-between p-4">
                    <div>
                        <div className="mb-8 pl-2 text-4xl font-bold">
                            <h1>POSTIT</h1>
                        </div>

                        <nav>
                            <ul>
                                <li className="mb-4">
                                    <Link to="/homefeed" className="flex items-center text-lg active:bg-gray-700 p-2" >
                                        <span>Home</span>
                                    </Link>
                                    <Link to="/explorepage" className="flex items-center text-lg active:bg-gray-700 p-2" >
                                        <span>Explore</span>
                                    </Link>
                                    <Link to="/savedposts" className="flex items-center text-lg active:bg-gray-700 p-2" >
                                        <span>Saved</span>
                                    </Link>
                                    <Link to="/searchuser" className="flex items-center text-lg active:bg-gray-700 p-2" >
                                        <span>Search</span>
                                    </Link>
                                    <Link to="/createpost" className="flex items-center text-lg active:bg-gray-700 p-2" >
                                        <span>Create a Post</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div>
                        <Link to={`/userprofile/${currentUser.id}`} className="flex items-center text-lg active:bg-gray-700 p-2 mb-4" >
                            <span>Profile ( {currentUser.username} )  </span>
                        </Link>

                        <a href="#" className="flex items-center text-lg active:bg-gray-700 p-2 "
                            onClick={() => {
                                handleLogout()
                            }}>
                            <span>Logout</span>
                        </a>
                    </div>
                </div>}
        </>
    )
}
