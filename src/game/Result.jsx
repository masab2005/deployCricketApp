import React, { useEffect,useState } from 'react';
import service from '../appwrite/conf.js';
import { updateUserData } from '../store/authSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import Nav from '../navBar/Nav.jsx';
import LoadingSpinner from '../LoadingSpinner.jsx';
function Result({ isCorrect, correctAnswer, currentScore, imageUrl, onNext }) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const userGameData = useSelector((state) => state.auth.userGameData);
  const existingScore = userGameData?.score || 0;
  const currentIndex = (userGameData?.currentIndex || 0) + 1;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function updateUserScoreAndIndex() {
      try {
        setLoading(true);
        setError(null);
        const updatedUser = await service.updateUserScore(userData.$id,existingScore, currentScore, currentIndex);
        dispatch(updateUserData({ userGameData: updatedUser }));
      } catch (error) {
        setError("Failed to save your score. Your progress may not be updated.");
      } finally {
        setLoading(false);
      }
    }

    if (userData?.$id) {
      updateUserScoreAndIndex();
    }
  }, []);

  if(loading) return <LoadingSpinner/>

  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-gray-900 py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
        {/* Result Header */}
        <div className={`py-6 px-8 text-center ${
          isCorrect 
            ? 'bg-green-800' 
            : 'bg-red-800'
        }`}>
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isCorrect 
              ? 'bg-green-700 text-green-200' 
              : 'bg-red-700 text-red-200'
          }`}>
            {isCorrect ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isCorrect ? 'Correct Answer!' : 'Not Quite Right'}
          </h2>
        </div>

        {/* Player Image */}
        <div className="px-8 py-6 bg-gray-700 flex justify-center">
          {imageUrl ? (
            <div className="relative">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-600">
                <img 
                  src={imageUrl} 
                  alt="Player"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-600 flex items-center justify-center">
              <p className="text-gray-400">No image</p>
            </div>
          )}
        </div>

        {/* Result Details */}
        <div className="px-8 py-6 bg-gray-800">
          <div className="space-y-4">
            {error && (
              <div className="mb-4 bg-red-900/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Correct Answer:</span>
              <span className="text-lg font-bold text-yellow-400">{correctAnswer}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Points Earned:</span>
              <span className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? `+${currentScore}` : '0'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Score:</span>
              <span className="text-lg font-bold text-white">{existingScore}</span>
            </div>
          </div>
          
          <button 
            onClick={onNext}
            className="w-full mt-8 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition-colors"
          >
            Next Player
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Result;
