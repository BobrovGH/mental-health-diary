import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }), // Send username and password
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful', data);
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('username', username);
            navigate('/');
        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-24">
            <div className="text-center w-full max-w-2xl px-4">
                <h1 className="text-3xl font-bold mb-2">Terapy</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Terapy — место, где ты сможешь познакомиться с собой и своими чувствами
                </p>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
                    <h2 className="text-2xl font-semibold text-center mb-4">Авторизация</h2>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
                            Имя пользователя
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                            Пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Войти
                    </button>

                    <p className="text-center text-sm mt-4">
                        Ещё нет аккаунта?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            className="text-orange-500 hover:underline cursor-pointer"
                        >
                            Зарегистрироваться
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;