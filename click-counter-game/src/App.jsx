import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  );
  const [doublePoints, setDoublePoints] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (count > highScore) {
        setHighScore(count);
        localStorage.setItem('highScore', count);
      }
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const handleClick = () => {
    if (!isActive && timeLeft === 10) setIsActive(true);
    if (isActive) setCount((prev) => prev + (doublePoints ? 2 : 1));
  };

  const resetGame = () => {
    setCount(0);
    setTimeLeft(10);
    setIsActive(false);
    setDoublePoints(false);
  };

  const activateDoublePoints = () => {
    if (!isActive || doublePoints) return;
    setDoublePoints(true);
    setTimeout(() => setDoublePoints(false), 5000);
  };

  return (
    <div className="container">
      <h1>Click Counter Game</h1>
      <h2>⏱ Time Left: {timeLeft}s</h2>
      <h2>🎯 Score: {count}</h2>
      <h3>🏆 High Score: {highScore}</h3>

      <button onClick={handleClick} className="main-button">
        Click Me!
      </button>
      <button onClick={resetGame} className="reset-button">
        Reset
      </button>
      <button
        onClick={activateDoublePoints}
        disabled={doublePoints || !isActive}
        className={`bonus-button ${doublePoints ? 'active' : ''}`}
      >
        {doublePoints ? 'Double Active!' : 'Double Points (5s)'}
      </button>

      {!isActive && timeLeft === 0 && (
        <p className="game-over">⏰ Time's up! Click Reset to try again.</p>
      )}
    </div>
  );
}

