import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/IsUserAuthenticated';
import { dayTitle, daysSince } from '../../utils/countAndDisplayDays';
import ChangePassword from './ChangePassword'; // Import the new component

const UserPage: React.FC = () => {
    const { isAuthenticated, username } = useAuth();
    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        date_joined: '',
        profile_pic: '',
    });
    const [showChangePassword, setShowChangePassword] = useState(false); // Track if the component should be shown

    const fetchUserData = async () => {
        if (isAuthenticated && username) {
            try {
                const response = await fetch(`/api/users/user_data?username=${username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated, username]);

    if (showChangePassword) {
        return <ChangePassword />; // Render ChangePassword dynamically
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Профиль пользователя</h2>
            <div className="flex items-center space-x-4">
                {userData.profile_pic ? (
                    <img
                        src={userData.profile_pic}
                        alt="ProfilePic"
                        className="w-16 h-16 rounded-full"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-400"></div>
                )}
                <div>
                    <p className="text-lg font-semibold">
                        {userData.first_name} {userData.last_name}
                    </p>
                    <p className="text-sm text-gray-500">@{userData.username || 'Имя пользователя'}</p>
                </div>
            </div>
            <div className="mt-6">
                <p>Электронная почта: {userData.email || 'email@example.com'}</p>
                <p>
                    Присоединился {daysSince(userData.date_joined)}{' '}
                    {dayTitle(daysSince(userData.date_joined))} назад
                </p>
            </div>
            <div className="mt-6 space-y-4">
                <button
                    onClick={() => setShowChangePassword(true)} // Show ChangePassword component
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                >
                    Изменить пароль
                </button>
                <button
                    className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                >
                    Удалить аккаунт
                </button>
            </div>
        </div>
    );
};

export default UserPage;
