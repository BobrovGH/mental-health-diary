import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(null);

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);
    
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            setIsSubmitting(false);
            return;
        }
    
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('password', password);
    
        // Add profile pic if exists
        if (profilePic) {
            formData.append('profile_pic', profilePic);
        }
    
        try {
            const response = await fetch('/api/users/register/', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                setSuccess('Регистрация прошла успешно!');
                setEmail('');
                setUsername('');
                setFirstName('');
                setLastName('');
                setPassword('');
                setConfirmPassword('');
                setProfilePic(null);  
                const profilePicInput = document.querySelector('input[type="file"]');
                if (profilePicInput) {
                    profilePicInput.value = ''; // Reset profile pic field
                }
            } else {
                const data = await response.json();
                setError(data.error || 'Ошибка регистрации');
            }
        } catch (err) {
            setError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-semibold text-center mb-4">Регистрация</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='example@mail.ru'
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Имя пользователя <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='BestUser'
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Имя <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder='Иван'
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Фамилия <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder='Иванов'
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Пароль <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Подтвердите пароль <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
                        Фото профиля
                    </label>
                    <input
                        id="profilePic"
                        type="file"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    Зарегистрироваться
                </button>

                <p className="text-center text-sm mt-4">
                    Уже есть аккаунт?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-orange-500 hover:underline cursor-pointer"
                    >
                        Войти
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Registration;
