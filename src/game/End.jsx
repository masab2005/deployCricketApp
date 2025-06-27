import React from 'react';
import LogOutBtn from '../account/LogOutBtn';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function End() {
  const userGameData = useSelector((state) => state.auth.userGameData);
  const finalScore = userGameData?.score || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Trophy Section */}
        <div className="py-8 px-6 text-center border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Game Over!
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            You've reached the end of all available players
          </p>
          
          <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-4">
            <div className="text-sm text-slate-400 mb-1">Your Final Score</div>
            <div className="text-4xl font-bold text-amber-400">{finalScore}</div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <p className="text-slate-300 text-center mb-8">
            Check back soon for more players to test your cricket knowledge!
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/leaderboard"
              className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              View Leaderboard
            </Link>
            
            <LogOutBtn/>
          </div>
        </div>
        
        {/* Footer */}
        <div className="py-4 px-6 bg-slate-900/80 border-t border-slate-700/50 text-center backdrop-blur-sm">
          <p className="text-slate-400 text-sm">Thank you for playing Crease Code!</p>
        </div>
      </div>
    </div>
  );
}

export default End;
