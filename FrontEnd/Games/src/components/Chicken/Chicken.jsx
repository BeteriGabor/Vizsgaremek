import { useState, useEffect } from "react";
import Navbar from '../Navbar/Navbar';

const ChickenGame = () => {
  const [position, setPosition] = useState(0);
  const [obstacle, setObstacle] = useState(Math.floor(Math.random() * 10) + 1);
  const [gameOver, setGameOver] = useState(false);
  const [carVisible, setCarVisible] = useState(false);
  const [carLeft, setCarLeft] = useState(0);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [playerWon, setPlayerWon] = useState(false);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const carPos = (screenWidth / 11) * obstacle;
    setCarLeft(carPos);
  }, [obstacle]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setMultiplier(position * 0.5+1);
    }
  }, [position, gameStarted, gameOver]);

  const startGame = () => {
    if (bet <= 0 || bet > Navbar.credits) {
      setMessage("Please place a valid bet.");
      return;
    }
    
    resetGame();
    setGameStarted(true);
    Navbar.setCredits = Navbar.credits - bet; 
  };

  const nextStep = () => {
    if (!gameOver && gameStarted) {
      const newPosition = position + 1;
      setPosition(newPosition);
      
      if (newPosition === obstacle && obstacle !== 11) {
        setGameOver(true);
        setCarVisible(true);
        setPlayerWon(false);
      }else if (newPosition === 11) {
        setGameOver(true);
        setPlayerWon(true);
        const winnings = bet * multiplier * 1.5;
        Navbar.setCredits = Navbar.credits + winnings;
      }
    }
  };

  const resetGame = () => {
    const newObstacle = Math.floor(Math.random() * 11) + 1; 
    setPosition(0);
    setObstacle(newObstacle);
    setGameOver(false);
    setCarVisible(false);
    setMultiplier(1);
  
    const screenWidth = window.innerWidth;
    setCarLeft((screenWidth / 12) * newObstacle); 
  };

  const stand = () => {
    if (!gameStarted || gameOver) {
      return;
    }
    const winnings = bet * multiplier;
    Navbar.setCredits = Navbar.credits + winnings; 
    setMessage(`You cashed out with ${winnings} credits!`);
    setPlayerWon(true)
    setGameStarted(false);
    setGameOver(true);
  };

  return (
    <>
      <Navbar></Navbar>
       
      <div className="w-screen bg-chickenbg h-screen">
        <div className="pt-20 px-4">
          <div className="text-white justify-items-center">
            <p className="text-5xl ">Current multiplier: {multiplier}x</p>
          </div>

          {carVisible && (
            <img className="absolute top-0 w-36 h-36 animate-carFall bg-cover"  style={{ left: `${carLeft}px` }} src="car.png" alt="" />
          )}

          
            {gameOver ? (
              playerWon?(
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-green-600 font-bold">You Won!</p>
              ):(
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-red-600 font-bold">Game Over!</p>
              )
            ) : (
              <img className="w-36 h-36 absolute top-2/4" 
              style={{ 
                transform: `translateX(${position*10}rem)`, 
                transition: "transform 0.3s ease" 
              }}
              onClick={nextStep} src="chicken.png" alt="" />
            )}
          

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col space-y-4 items-center bg-slate-500 p-5  rounded-xl">
            <div className="flex space-x-4">
              <button 
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors" 
                onClick={startGame}
                disabled={gameStarted && !gameOver}
              >
                New Game
              </button>
              
              <button 
                className="bg-green-700 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-green-800 transition-colors" 
                onClick={stand}
                disabled={!gameStarted || gameOver}
              >
                Cash Out
              </button>
            </div>

            <div className="form-control w-full max-w-xs">
              <label htmlFor="bet-amount" className="block text-white mb-2 text-xl">Bet Amount</label>
              <select 
                id="bet-amount"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="w-full p-2 bg-white text-black rounded-lg shadow-md text-xl"
                disabled={gameStarted && !gameOver}
              >
                {[10, 20, 50, 100].map((amount) => (
                  <option key={amount} value={amount}>
                    {amount} Credits
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <style>
          {`
            @keyframes carFall {
              from { transform: translateY(-100px); }
              to { transform: translateY(1000px); }
            }
            .animate-carFall {
              animation: carFall 0.2s linear;
            }
          `}
        </style>
        
      </div>
    </>
  );
};

export default ChickenGame;