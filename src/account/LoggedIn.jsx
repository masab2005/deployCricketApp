import React, { useEffect, useState } from 'react';
import authService from '../appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, updateUserData } from '../store/authSlice';
import service from '../appwrite/conf';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

function LoggedIN() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.status);

  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const user = await authService.getCurrentUser();
        
        if (user) {
          dispatch(login({ userData: user }));
          
          try {
            const gameData = await service.getUserInfo(user.$id);
            dispatch(updateUserData({ userGameData: gameData }));
          } catch (gameDataError) {
            setError("Failed to load game data. Your progress might not be saved.");
            // Continue anyway since authentication was successful
          }
          
          setLoading(false);
          navigate('/game');
        } else {
          // User is not authenticated
          dispatch(logout());
          setLoading(false);
          navigate('/login');
        }
      } catch (error) {
        dispatch(logout());
        setLoading(false);
        navigate('/login');
      }
    };
    checkAuthAndNavigate();
    
  }, [dispatch]);
  
  if (loading) return <LoadingSpinner />;
  
  return null;
}

export default LoggedIN;