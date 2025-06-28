import React, { useState } from 'react';
import Game from './Game';

function GameWrapper() {
  const [gameKey, setGameKey] = useState(0);

  const handleNext = () => {
    localStorage.removeItem('gameState');
    setGameKey(prev => prev + 1); 
  };

  return <Game key={gameKey} onNext={handleNext} />;
}

export default GameWrapper;