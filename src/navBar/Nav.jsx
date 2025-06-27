import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { Menu, X, Home, Award, LogOut, User } from 'lucide-react';

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData);
  const userGameData = useSelector((state) => state.auth.userGameData);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
    localStorage.removeItem('gameState');
    localStorage.removeItem('persist:root');
    navigate('/login');
  };

  // Check if a path is active
  const isActive = (paths) =>
    paths.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

  // Navigation items
  const navItems = [
    { 
      name: 'Game', 
      path: '/game', 
      icon: <Home className="w-4 h-4" />,
      isActive: isActive(['/', '/game'])
    },
    { 
      name: 'Leaderboard', 
      path: '/leaderboard', 
      icon: <Award className="w-4 h-4" />,
      isActive: isActive(['/leaderboard'])
    }
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-1.5 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="ml-2 font-bold text-lg text-white">
                {userData?.name}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl py-1 px-1 flex items-center border border-slate-700/50">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                    item.isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                  }`}
                >
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </Link>
              ))}
              
              {/* User Score */}
              <div className="ml-2 mr-1 px-3 py-1 bg-slate-700/70 rounded-lg flex items-center">
                <span className="text-amber-400 font-medium">{userGameData?.score || 0}</span>
                <span className="ml-1 text-xs text-slate-400">pts</span>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center px-3 py-1.5 text-sm bg-slate-700/70 hover:bg-slate-700/90 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-1 text-red-400" />
              <span className="text-white">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/50 hover:bg-slate-700/70 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-700/50 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center py-2 px-3 rounded-lg ${
                  item.isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            
            <div className="flex items-center justify-between py-2 px-3">
              <div className="flex items-center">
                <User className="w-4 h-4 text-slate-400" />
                <span className="ml-2 text-slate-300">{userData?.name}</span>
              </div>
              <div className="bg-slate-800/70 px-2 py-0.5 rounded-md">
                <span className="text-amber-400 text-sm">{userGameData?.score || 0} pts</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-3 mt-2 bg-slate-700/70 hover:bg-slate-700/90 border border-red-500/30 hover:border-red-500/50 rounded-lg text-white transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2 text-red-400" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
