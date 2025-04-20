import React, { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import useSound from "use-sound";
import coinSound from "../components/assets/sounds/coin.wav";
import winSound from "../components/assets/sounds/win.mp3";
import loseSound from "../components/assets/sounds/lose.mp3";
import { updateCredits } from "../utils/updateCredits";
import { useChickenGame } from "../hooks/useChickenGame";

const ChickenGame = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);
  const navbarRef = useRef();

  const {
    position,
    obstacle,
    gameOver,
    carVisible,
    bet,
    message,
    gameStarted,
    multiplier,
    playerWon,
    credits,
    setBet,
    handlePlaceBet,
    handleStep,
    handleCashOut,
    resetGame,
    setCredits,
  } = useChickenGame({
    playCoin,
    playWin,
    playLose,
    navbarRef,
  });

  useEffect(() => {
    updateCredits(navbarRef, setCredits);
  }, []);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="w-screen h-screen relative bg-slate-600 overflow-hidden">
        <div
          className="absolute top-0 left-[45%] h-full w-[2000px] bg-chickenmap transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${position * 10}rem)` }}
        ></div>

        {carVisible && (
          <img
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 animate-carFall"
            src="car.png"
            alt="Car"
          />
        )}

        {!gameOver && (
          <img
            className="w-28 h-28 absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            onClick={handleStep}
            src="chicken.png"
            alt="Chicken"
          />
        )}

        {gameOver && (
          <p
            className={`text-center z-50 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold ${
              playerWon ? "text-green-600" : "text-red-600"
            }`}
          >
            {playerWon ? "You Won!" : "Game Over!"}
            <p className="text-white font-bold mt-2 text-xl">{message}</p>
          </p>
        )}

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col space-y-4 items-center bg-slate-700 border-gray-900 border-8 p-4 rounded-xl z-20 w-[90%] max-w-md">
          <div className="text-white text-lg font-bold text-center">
            Current multiplier: {multiplier.toFixed(2)}x
          </div>
          <div className="flex flex-wrap justify-center space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-base font-bold hover:bg-blue-600 transition-colors"
              onClick={handlePlaceBet}
              disabled={gameStarted && !gameOver}
            >
              Place Bet
            </button>
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-lg text-base font-bold hover:bg-green-800 transition-colors"
              onClick={handleCashOut}
              disabled={!gameStarted || gameOver}
            >
              Cash Out
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-full p-2 bg-gray-900 text-white rounded-lg shadow-md text-base"
              disabled={gameStarted && !gameOver}
            >
              {[10, 20, 50, 100, 200, 500, 1000].map((amount) => (
                <option key={amount} value={amount} disabled={amount > credits}>
                  {amount} Credits
                </option>
              ))}
            </select>
            <img
              src={`/chips/${bet}.png`}
              alt={`${bet} chip`}
              className="w-10 h-10"
            />
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
