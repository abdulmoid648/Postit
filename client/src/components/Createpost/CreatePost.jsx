import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserState";

const CreatePost = () => {
    const [text, setText] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const userContext = useContext(UserContext);
    const { currentUser, authToken } = userContext;

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text.length < 3) {
            setError("Caption must be at least 3 characters.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/post/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken, // Pass the token if required
                },
                body: JSON.stringify({
                    postedBy: currentUser.id,
                    username: currentUser.username,
                    text,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create post.");
            }

            setText(""); // Clear input after success
            alert("Post created successfully!");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-xl font-bold mb-4 text-center">Create Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm">Caption</label>
                        <textarea
                            name="text"
                            value={text}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                            required
                            placeholder="Write something..."
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
