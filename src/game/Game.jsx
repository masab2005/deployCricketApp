import React, { useEffect, useState } from 'react';
import service from '../appwrite/conf.js';
import Result from './Result.jsx';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner.jsx';
import Nav from '../navBar/Nav.jsx';
import { useNavigate } from 'react-router-dom';
const hintLabels = [
  "Country",
  "Role",
  "Debut Year",
  "Total Matches",
  "Franchise",
  "Born",
  "Retired?"
];



function Game({onNext}) {
  const userGameData = useSelector((state) => state.auth.userGameData);
  const userData = useSelector((state) => state.auth.userData);
  const [correctAnswer,setCorrectAnswer ] = useState("")
  const [revealedHints, setRevealedHints] = useState([]);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [ hintValues,setHintValues ] = useState([])
  const [count,setCount] = useState(6);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const maxScore = 100;
  const scorePerHint = 10;
  const currentScore = maxScore - revealedHints.length * scorePerHint;

  // Save game state to localStorage when component unmounts or state changes
  useEffect(() => {
    // Only save if we have a valid game in progress
    if (userGameData?.currentIndex !== undefined && correctAnswer) {
      const gameState = {
        revealedHints,
        count,
        playerIndex: userGameData.currentIndex
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [revealedHints, count, correctAnswer]);

const [error, setError] = useState(null);

useEffect(() => {
  async function fetchPlayer() {
    try {
      setLoading(true);
      setError(null);
      if (userGameData?.currentIndex === undefined) return;
      
      const player = await service.getPlayer(userGameData.currentIndex); 
      if (player) {
        setHintValues(player.hints);
        setCorrectAnswer(player.playerName);
        setImageUrl(service.getFilePreview(player.imageID));
        
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          if (parsedState.playerIndex === userGameData.currentIndex) {
            setRevealedHints(parsedState.revealedHints || []);
            setCount(parsedState.count || 6);
          } else {
            localStorage.removeItem('gameState');
            setRevealedHints([]);
            setCount(6);
          }
        } else {
          setRevealedHints([]);
          setCount(6);
        }
      } else {
        setLoading(false);
        localStorage.removeItem('gameState');
        navigate('/end');
      }
    } catch (error) {
      setError("Unable to load player data. Please try again later.");
    } finally{
      setLoading(false);
    }
  }

  if (userGameData && userGameData.currentIndex !== undefined) {
    fetchPlayer();
  }
}, []);

  

  const handleRevealHint = (index) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();

    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedAnswer = correctAnswer.trim().toLowerCase();

    // Prevent empty input from being accepted as correct
    let isCorrect = false;
    if (normalizedGuess.length > 0) {
      // Split answer into words (first name, last name, etc.)
      const answerWords = normalizedAnswer.split(/\s+/);
      
      // Check if guess exactly matches any word in the answer (first/last name)
      const isWordMatch = answerWords.some(word => word === normalizedGuess);
      
      
      isCorrect =
        normalizedGuess === normalizedAnswer || // Full name match
        isWordMatch               // Significant substring match
    }

    setIsCorrect(isCorrect);

    if (guess !== "") setCount(prev => prev - 1);
    setGuess("");
  };

  useEffect(() => {
  if (isCorrect !== null) {
    if(isCorrect === true) {
      setIsCorrect(true);
      localStorage.removeItem('gameState');
    }
    else{
    const timer = setTimeout(() => {
      setIsCorrect(null);
    }, 3000);

    return () => clearTimeout(timer);
  }
  }
}, [isCorrect]);

  if (loading) return <LoadingSpinner/>
  if (error) {
    return (
      <>
        <Nav/>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 flex items-center justify-center">
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden p-8 max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl text-center font-bold text-white mb-2">Error</h2>
            <p className="text-slate-300 text-center mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }
  if (isCorrect === true) {
    // Clear localStorage when game is completed
    localStorage.removeItem('gameState');
    return (
      <Result
    isCorrect={true}
    correctAnswer={correctAnswer}
    currentScore={currentScore}
    imageUrl={imageUrl}
    onNext={onNext}
  />
    );
  }
  if (count === 0 && !isCorrect) {
    // Clear localStorage when game is completed
    localStorage.removeItem('gameState');
    return (
      <Result
        isCorrect={false}
        correctAnswer={correctAnswer}
        currentScore={0}
        imageUrl={imageUrl}
        onNext={onNext}
      />
    );
  }

  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Game Header with Score and Attempts */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 pl-5 pr-7 py-4 rounded-xl shadow-lg">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Current Score</p>
            <div className="flex items-baseline">
              <span className="text-cyan-400 text-3xl font-bold">{currentScore}</span>
              <span className="text-slate-500 ml-1 text-sm">pts</span>
            </div>
          </div>
          
          <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 pl-7 pr-5 py-4 rounded-xl shadow-lg text-right">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Guesses Left</p>
            <div className="flex items-baseline justify-end">
              <span className="text-amber-400 text-3xl font-bold">{count}</span>
              <span className="text-slate-500 ml-1 text-sm">/ 6</span>
            </div>
          </div>
        </div>
        
        {/* Main Game Container */}
        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Title Bar */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Crease <span className="text-amber-400 font-extrabold">code</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">Guess the player to earn points</p>
              </div>
              <div className="hidden sm:block">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hints Section */}
          <div className="p-6 md:p-8 border-b border-slate-700/50">
            <h2 className="flex items-center text-lg font-bold text-white mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              PLAYER HINTS
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {hintLabels.map((label, index) => (
                <div key={index} className="relative">
                  {!revealedHints.includes(index) ? (
                    <button
                      onClick={() => handleRevealHint(index)}
                      className="w-full py-4 px-5 bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-500/50 text-left text-white font-medium rounded-xl shadow-md transition-all duration-200 group"
                    >
                      <span className="block text-sm">{label}</span>
                      <div className="flex items-center mt-1.5">
                        <span className="text-xs text-red-400 font-medium">-{scorePerHint} pts</span>
                        <span className="ml-auto text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-full py-4 px-5 bg-slate-700/70 border border-emerald-500/30 rounded-xl shadow-md">
                      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</div>
                      <div className="font-semibold text-emerald-400">{hintValues[index]}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Input Section */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleGuessSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter player name..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/70 border border-slate-700/70 focus:border-cyan-500/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-inner placeholder-slate-500 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
            
            {isCorrect === false && (
              <div className="mt-5 bg-red-900/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400 font-medium">Incorrect guess. Try again!</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="py-4 px-6 bg-slate-900/80 border-t border-slate-700/50 text-center backdrop-blur-sm">
            <p className="text-slate-400 text-sm">Each hint reduces your potential score by <span className="text-amber-400 font-medium">{scorePerHint}</span> points</p>
          </div>
        </div>

        {/* Tip Card */}
        <div className="mt-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4 flex items-center">
          <div className="bg-blue-500/20 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-slate-300 text-sm">Start with less valuable hints like <span className="text-cyan-400 font-medium">Country</span> or <span className="text-cyan-400 font-medium">Role</span> to maximize your score.</p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Game;
