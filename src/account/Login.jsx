import React from 'react';
import { login as authLogin } from '../store/authSlice'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../appwrite/auth' 
import { useDispatch } from 'react-redux';
import service from '../appwrite/conf.js';
import { updateUserData } from '../store/authSlice.js';
import LoadingSpinner from '../LoadingSpinner.jsx';

function Login(){

  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Get the intended destination from location state, or default to '/game'
  const from = location.state?.from || '/game';

  const getErrorMessage = (error) => {
    const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
    
    if (errorMessage.includes("Invalid credentials")) {
      return "Email or password is incorrect. Please try again.";
    }
    
    if (errorMessage.includes("User not found")) {
      return "No account found with this email. Please sign up first.";
    }
    
    if (errorMessage.includes("Rate limit")) {
      return "Too many login attempts. Please try again later.";
    }
    
    return errorMessage;
  };

  const login = async (data) =>{
    setError("");
    setLoading(true);
    try{
        const { email, password } = data;
        const session = await authService.login(email, password);

        if(session){
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const userData = await authService.getCurrentUser();
          if(userData){ 
               dispatch(authLogin({ userData : userData }));
               const gameData =  await service.getUserInfo(userData.$id);
               dispatch(updateUserData({ userGameData : gameData }));
               navigate(from); 
          } else {
            setError("Failed to get user data. Please try again.");
          }
        }
    } catch(error){
      console.error("Login error:", error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }  
  if(loading) return <LoadingSpinner/>
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.02A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">
          Sign in to your account
        </h2>
      </div>
        
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden py-8 px-4 sm:px-10">
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit(login)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  className={`appearance-none block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-slate-600/50'} bg-slate-700/50 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/70 transition-colors sm:text-sm`}
                  {...register('email', { 
                    required: "Email is required",
                    validate: {
                      matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address"
                    } 
                  })}
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`appearance-none block w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-slate-600/50'} bg-slate-700/50 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/70 transition-colors sm:text-sm`}
                  {...register('password', { 
                    required: "Password is required" 
                  })}
                />
                {errors.password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-800"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
