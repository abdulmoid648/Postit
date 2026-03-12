import React, { useState, useContext } from "react";
import { UserContext } from "./../../contexts/UserState";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    const [query, setQuery] = useState(""); // Store the search query
    const [results, setResults] = useState([]); // Store the search results
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error state
    const { authToken } = useContext(UserContext);
    const navigate = useNavigate()

    // Handle search input change
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setTimeout(() => {
            handleSearch(e)
        }, 500);
    };

    // Handle form submission (search users)
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        setError(""); // Reset error message

        try {
            const response = await fetch(`http://localhost:5000/api/user/search?query=${query}`, {
                method: "GET",
                headers: {
                    Authorization: authToken,
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("No users found");
            }
            const data = await response.json();
            setResults(data); // Store the search results
        } catch (error) {
            setError(error.message); // Handle error
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-2xl font-bold mb-4 text-center">Search Users</h2>

                {/* Search Form */}
                <form onSubmit={handleSearch}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Search by username or display name"
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                        />
                    </div>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <div className="mt-4">
                    {results.length === 0 && !loading && !error && (
                        <p className="text-gray-500 text-center">No results found</p>
                    )}
                    {results.map((user) => (
                        <div onClick={()=>navigate(`/userprofile/${user._id}`)} key={user._id} className="flex mb-4 p-4 bg-gray-700 rounded-lg">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                                alt={user.username}
                                className="w-10 aspect-sqaure rounded-full mb-2 object-cover"
                            />
                            <div className="ml-5">
                            <h3 className="font-semibold text-white">{user.username}</h3>
                            <p className="text-gray-400">{user.displayName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
