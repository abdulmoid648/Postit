import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../contexts/UserState";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userContext = useContext(UserContext)
    const { currentUser, userLogin } = userContext

    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser !== null) {
            navigate("/homefeed")
        }
    }, [currentUser])

    const handleLogin = (e) => {
        e.preventDefault();
        userLogin(email, password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <div className="w-96 p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
                <h2 className="text-3xl font-semibold text-gray-200 text-center">Login</h2>
                <form onSubmit={handleLogin} className="mt-6">
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all"
                    >
                        Login
                    </button>

                </form>
                <p className="text-gray-400 text-sm mt-4 text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
                </p>
            </div>
        </div>

    );
};

export default Login;
