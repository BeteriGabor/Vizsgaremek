import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

const Aviator = () => {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [positions, setPositions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [bet, setBet] = useState(10);
  const [availableCredits, setAvailableCredits] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let flightInterval;
    if (isFlying) {
      setStatusMessage("We wish you a successful flight!");
      let x = 0,
        y = 0,
        m = 1.0;
      let startTime = Date.now();

      flightInterval = setInterval(() => {
        m = parseFloat((m * 1.01).toFixed(4));
        let elapsedTime = Date.now() - startTime;
        let t = elapsedTime / 1000;
        x = x * 1.00001 + 1;
        y = Math.max(0, 0.5 * Math.pow(t, 2));
        setMultiplier(m);
        setPositions((prev) => [...prev, { x, y }]);

        if (y > 400) {
          clearInterval(flightInterval);
          setIsFlying(false);
          setGameStarted(false);
          setStatusMessage("You won!");
        }
      }, 100);

      const randomFlightDuration =
        Math.floor(Math.random() * (12000 - 0 + 1)) + 0;

      setTimeout(() => {
        clearInterval(flightInterval);
        setIsFlying(false);
        setGameStarted(false);
        setStatusMessage("The plane crashed! You lost your bet.");
      }, randomFlightDuration);
    } else {
      setPositions([]);
    }

    return () => clearInterval(flightInterval);
  }, [isFlying]);

  const placeBet = async () => {
    if (bet <= 0 || bet > availableCredits) {
      setStatusMessage("Invalid bet amount!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:1010/auth/place`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            amount: bet,
          },
        }
      );

      console.log("Bet placed:", response.data);
      setAvailableCredits((prev) => prev - bet);
      setIsFlying(true);
      setIsVisible(true);
      setGameStarted(true);
    } catch (error) {
      console.error("Hiba a fogadás elküldésekor:", error);
      setStatusMessage("Bet failed.");
    }
  };

  const cashOut = () => {
    if (isFlying) {
      const winnings = Math.floor(bet * multiplier);
      setAvailableCredits((prev) => prev + winnings);
      setIsFlying(false);
      setGameStarted(false);
      setStatusMessage(
        `Cashed out: ${multiplier.toFixed(2)}x, You won ${winnings.toFixed(
          2
        )} credits!`
      );
      setMultiplier(1.0);
      setPositions([]);
    } else {
      setStatusMessage("There is no active game!");
    }
  };

  const pathData = positions
    .map((pos, index) => `${index === 0 ? "M" : "L"} ${pos.x} ${400 - pos.y}`)
    .join(" ");
  const rotation = Math.min(60, multiplier * 10);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-aviatorbg font-['Press Start 2P'] text-white px-4">
        <div className="flex flex-col items-center justify-center p-10 backdrop-blur-lg rounded-3xl">
          <div className="relative w-[300px] h-[400px] bg-aviatorgamebg bg-opacity-0 rounded-xl  overflow-hidden border-4 border-slate-800 mb-6">
            <svg className="absolute w-full h-full">
              <path
                d={pathData}
                stroke="red"
                strokeWidth="3"
                fill="transparent"
              />
            </svg>

            {isVisible && (
              <div
                className={`absolute transition-all duration-100 ${
                  isFlying ? "" : "animate-fall"
                }`}
                onAnimationEnd={() => setIsVisible(false)}
                style={{
                  left: `${
                    positions[positions.length - 1]?.x - rotation / 3
                  }px`,
                  bottom: `${positions[positions.length - 1]?.y}px`,
                  transform: `rotate(-${rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                <img src="airplane.png" alt="✈️" className="w-10 h-auto" />
              </div>
            )}
          </div>

          <div className="flex flex-row sm:flex-row gap-4 mb-4 items-center">
            <button
              onClick={placeBet}
              disabled={isFlying}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-transform duration-300 ${
                isFlying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:-translate-y-1 hover:bg-blue-800"
              }`}
            >
              Place Bet
            </button>

            <button
              onClick={cashOut}
              disabled={!isFlying}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-transform duration-300 ${
                !isFlying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:-translate-y-1 hover:bg-green-800"
              }`}
            >
              Cash Out
            </button>
          </div>
          <select
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={gameStarted}
            className="p-2 bg-white text-black rounded-lg shadow-md text-sm font-bold"
          >
            {[10, 20, 50, 100, 200, 500].map((amount) => (
              <option key={amount} value={amount}>
                {amount} Credits
              </option>
            ))}
          </select>
          <div className="text-xl sm:text-2xl font-bold text-white drop-shadow">
            Multiplier: <span>{multiplier.toFixed(2)}x</span>
          </div>

          <p className="italic text-sm sm:text-base text-gray-300 drop-shadow-sm text-center">
            {statusMessage}
          </p>

          <style>
            {`
                    @keyframes fall {
                        from { transform: translateY(${
                          positions[positions.length - 1]?.y
                        }px); }
                        to { transform: translateY(1000px); }
                    }
                    .animate-fall {
                        animation: fall 0.4s linear forwards;
                    }
                `}
          </style>
        </div>
      </div>
    </>
  );
};

export default Aviator;
