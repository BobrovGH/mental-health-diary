import React, { useState } from 'react';
import { changePassword } from '../../utils/api';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
      
        if (newPassword !== confirmPassword) {
          setError('Пароли не совпадают.');
          return;
        }
      
        try {
          const response = await changePassword(currentPassword, newPassword, confirmPassword);
          if (response.ok) {
            setSuccess('Пароль успешно изменен.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            setError(response.error || 'Ошибка при смене пароля.');
          }
        } catch (err) {
          setError('Произошла ошибка. Попробуйте снова.');
        }
      };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Смена пароля</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Текущий пароль
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Новый пароль
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Подтвердите новый пароль
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                >
                    Изменить пароль
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;