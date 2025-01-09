import React from 'react';

const UserPage: React.FC = () => {
  const handlePasswordChange = () => {
    console.log('Change password');
  };

  const handleAccountDelete = () => {
    console.log('Delete account');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Профиль пользователя</h2>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-400"></div>
        <div>
          <p className="text-lg font-semibold">Имя пользователя</p>
          <p className="text-sm text-gray-500">email@example.com</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <button
          onClick={handlePasswordChange}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Изменить пароль
        </button>
        <button
          onClick={handleAccountDelete}
          className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
        >
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
};

export default UserPage;
