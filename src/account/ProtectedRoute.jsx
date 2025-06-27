import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';
import authService from '../appwrite/auth';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we already know the user is logged in from Redux
        if (isLoggedIn) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // Double-check with Appwrite if needed
        const user = await authService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, [isLoggedIn]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute; 