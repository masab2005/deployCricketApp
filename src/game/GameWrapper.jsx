import React, { useState } from 'react';
import Game from './Game';

function GameWrapper() {
  const [gameKey, setGameKey] = useState(0);

  const handleNext = () => {
    setGameKey(prev => prev + 1); // forces Game to reset
  };

  return <Game key={gameKey} onNext={handleNext} />;
}

export default GameWrapper;