import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        displayName: "",
        email: "",
        password: "",
        accountType: "public",
        bio: "",
        profilePicture: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/user/userSignup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                if (data.authToken) {
                    localStorage.setItem("authToken", JSON.stringify(data.authToken));
                }
                alert("Signup successful!");
                navigate("/");
            } else {
                alert(data.error || (data.errors && data.errors[0].msg) || "Signup failed");
            }
        } catch (err) {
            alert("An error occurred: " + err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-2xl font-bold mb-4 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col">
                        
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm">Display Name</label>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                            required
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm">Account Type</label>
                        <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                        Sign Up
                    </button>
                </form>
                <p className="text-gray-400 text-sm mt-4 text-center">
                    Already have an account? <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
