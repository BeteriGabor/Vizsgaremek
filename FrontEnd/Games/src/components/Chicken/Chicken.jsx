import { useState } from "react";
import './Chicken.module.css';

const ChickenGame = () => {
  const [position, setPosition] = useState(0);
  const [obstacle, setObstacle] = useState(Math.floor(Math.random() * 10) + 1);
  const [gameOver, setGameOver] = useState(false);

  const nextStep = () => {
    if (!gameOver) {
      const newPosition = position + 1;
      setPosition(newPosition);
      if (newPosition === obstacle) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setPosition(0);
    setObstacle(Math.floor(Math.random() * 11) + 1);
    setGameOver(false);
  };

  return (
    <div className="container">
      <div className="">
        <p>Csirke pozíciója: {position}</p>
        <p>Akadály: {obstacle}</p>
        {gameOver ? (
          <p className="gameover">Játék vége! 🚧</p>
        ) : (
          <button
            className="chicken"
            style={{ transform: `translateX(${position*10}rem)`, transition: "transform 0.3s ease" }}
            onClick={nextStep}
          >
            
          </button>
        )}
        <button 
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg" 
          onClick={resetGame}
        >
          Új játék
        </button>
      </div>
    </div>
  );
};

export default ChickenGame;
