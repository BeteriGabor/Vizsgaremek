import { useState, useEffect } from "react";
import Navbar from '../Navbar/Navbar';

const ChickenGame = () => {
  const [position, setPosition] = useState(0);
  const [obstacle, setObstacle] = useState(Math.floor(Math.random() * 10) + 1);
  const [gameOver, setGameOver] = useState(false);
  const [carVisible, setCarVisible] = useState(false);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [playerWon, setPlayerWon] = useState(false);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setMultiplier(position * 0.5 + 1);
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
      } else if (newPosition === 11) {
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
  };

  const stand = () => {
    if (!gameStarted || gameOver) {
      return;
    }
    const winnings = bet * multiplier;
    Navbar.setCredits = Navbar.credits + winnings;
    setMessage(`You cashed out with ${winnings} credits!`);
    setPlayerWon(true);
    setGameStarted(false);
    setGameOver(true);
  };

  return (
    <>
      

      <div className="w-screen h-screen relative  bg-slate-600">
        <div
          className="absolute top-0 left-[45%] h-full w-[2000px] bg-chickenmap transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${position * 10}rem)`,
          }}
        >
          
        </div>
        <Navbar/>
        {carVisible && (
            <img
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 animate-carFall"
              src="car.png"
              alt="Car"
            />
          )}

        {!gameOver && (
          <img
            className="w-36 h-36 absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            onClick={nextStep}
            src="chicken.png"
            alt="Chicken"
          />
        )}

        {gameOver && (
          <p className={`z-50 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold ${playerWon ? 'text-green-600' : 'text-red-600'}`}>
            {playerWon ? 'You Won!' : 'Game Over!'}
          </p>
        )}


        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col space-y-4 items-center bg-slate-500 p-5 rounded-xl z-20">
          <div className="text-white text-2xl font-bold">Current multiplier: {multiplier.toFixed(2)}x</div>
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
