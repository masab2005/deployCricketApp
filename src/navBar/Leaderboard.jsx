import React, { useEffect, useState } from 'react';
import service from '../appwrite/conf';
import { useSelector } from 'react-redux';
import { Trophy, Star, Medal, ArrowLeft } from 'lucide-react';
import Nav from './Nav';
import { Link } from 'react-router-dom';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = useSelector((state) => state.auth.userData?.$id);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await service.getTopUsers();
        const sorted = response.documents.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.currentIndex - b.currentIndex;
        });
        setLeaderboard(sorted);
      } catch (error) {
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Trophy icons for top 3 players
  const trophyIcons = [
    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg">
      <Trophy className="w-6 h-6 text-yellow-900" />
    </div>,
    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 rounded-full shadow-lg">
      <Trophy className="w-6 h-6 text-slate-700" />
    </div>,
    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-lg">
      <Trophy className="w-6 h-6 text-amber-200" />
    </div>
  ];

  return (
    <>
    <Nav />
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/game" 
          className="inline-flex items-center mb-6 text-slate-400 hover:text-white transition-colors group"
        >
          <div className="mr-2 bg-slate-800/70 backdrop-blur-sm p-1.5 rounded-full border border-slate-700/50 group-hover:border-cyan-500/50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
          </div>
          <span>Back to Game</span>
        </Link>
        
        {/* Leaderboard Card */}
        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Leaderboard
                </h1>
                <p className="text-slate-400 text-sm mt-1">Top cricket masters</p>
              </div>
              <div className="hidden sm:block">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Leaderboard List */}
          <div className="px-6 pb-6 pt-4">
            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <div className="w-12 h-12 border-4 border-t-cyan-500 border-slate-700 rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p>No players on the leaderboard yet</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 ${
                      user.$id === currentUserId 
                        ? 'bg-blue-900/20 border border-cyan-500/30' 
                        : 'bg-slate-700/40 border border-slate-600/30'
                    } rounded-xl transition-all duration-300 backdrop-blur-sm`}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold text-slate-400 w-6 text-center">
                        {index + 1}
                      </div>
                      
                      {/* Trophy for top 3 */}
                      {index < 3 && trophyIcons[index]}
                      
                      {/* User Info */}
                      <div>
                        <div className="font-semibold text-lg flex items-center">
                          <span className="text-white">
                          <span className="hidden sm:inline">{user.username || `Player ${index + 1}`}</span>
                          <span className="sm:hidden">{user.username ? (user.username.length > 5 ? user.username.substring(0, 3) + "..." : user.username) : `Player ${index + 1}`}</span>
                          </span>
                          {user.$id === currentUserId && (
                            <span className="ml-2 text-xs bg-cyan-500/80 text-white px-2 py-0.5 rounded-full">You</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400 flex items-center">
                      {user.score}
                      <span className="text-slate-500 text-sm ml-1">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="py-4 px-6 bg-slate-900/80 border-t border-slate-700/50 text-center backdrop-blur-sm">
            <p className="text-slate-400 text-sm">Keep playing to climb the ranks!</p>
          </div>
        </div>

        {/* Tip Card */}
        <div className="mt-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4 flex items-center">
          <div className="bg-blue-500/20 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-slate-300 text-sm">Scores are based on how many hints you used. Fewer hints means higher scores!</p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Leaderboard;

