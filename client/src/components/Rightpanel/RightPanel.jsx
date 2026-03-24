import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserState";
import { UserMinus, UserPlus } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

export const RightPanel = () => {
    const navigate = useNavigate();
    const { currentUser, authToken } = useContext(UserContext);
    const [topCreators, setTopCreators] = useState([]);

    useEffect(() => {
        const fetchTopCreators = async () => {
            try {
                const response = await fetch("/api/user/top-creators", {
                    method: "GET",
                    headers: {
                        Authorization: authToken,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch top creators");
                }

                const data = await response.json();
                setTopCreators(data);
            } catch (error) {
                console.error("Error fetching top creators:", error);
            }
        };

        if (currentUser) {
            fetchTopCreators();
        }
    }, []);

    return (
        <>
            {currentUser !== null && (
                <div className="hidden md:block fixed top-0 right-0 text-gray-200 w-80 h-screen border-l border-gray-700 bg-gray-800 justify-between p-4 ">
                    <div className="mb-8 pl-2 text-xl font-bold">
                        <h1>Top Accounts to Follow</h1>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-2 gap-6">
                            {topCreators.length === 0 ? (
                                <p className="text-gray-400">No top creators available</p>
                            ) : (
                                topCreators.map((account, index) => (
                                    <div
                                        onClick={()=>navigate(`/userprofile/${account._id}`)}
                                        key={index}
                                        className="cursor-pointer bg-gray-700 border-1 border-gray-600 rounded-lg p-3 flex flex-col items-center w-35 h-fit"
                                    >
                                        <img
                                            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                                            alt={account.username}
                                            className="w-26 aspect-sqaure rounded-full mb-2 object-cover"
                                        />
                                        <span className="text-[12px] font-semibold text-center mb-2 text-gray-200 truncate w-full">
                                            {account.username}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
