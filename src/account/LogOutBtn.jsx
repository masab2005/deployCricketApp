import React from 'react';
import authService from '../appwrite/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

function LogOutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
    localStorage.removeItem('gameState');
    localStorage.removeItem('persist:root');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-3 px-6 bg-slate-700/70 hover:bg-slate-700/90 border border-red-500/30 hover:border-red-500/50 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-7z" clipRule="evenodd" />
      </svg>
      Logout
    </button>
  );
}

export default LogOutBtn;
