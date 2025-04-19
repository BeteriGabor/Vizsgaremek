import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import useSound from "use-sound";
import coinSound from "../components/assets/sounds/coin.wav";
import winSound from "../components/assets/sounds/win.mp3";
import loseSound from "../components/assets/sounds/lose.mp3";
import { placeBet } from "../utils/placeBets";
import { resolveBet } from "../utils/resolveBet";
import { updateCredits } from "../utils/updateCredits";


const Aviator = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  const [multiplier, setMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [positions, setPositions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [bet, setBet] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [betId, setBetId] = useState(null);
  const [fade, setFade] = useState(false);
  const [credits, setCredits] = useState(0);

  const navbarRef = useRef();

  useEffect(() => {
    updateCredits(navbarRef, setCredits);
  }, []);

  useEffect(() => {
    if (statusMessage) {
      setFade(true);
      const timer = setTimeout(() => {
        setFade(false);
        setStatusMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    let flightInterval;
    if (isFlying) {
      let x = 0, y = 0, m = 1.0;
      const startTime = Date.now();

      flightInterval = setInterval(() => {
        m = parseFloat((m * 1.01).toFixed(4));
        const t = (Date.now() - startTime) / 1000;
        x = x * 1.00001 + 1;
        y = Math.max(0, 0.5 * Math.pow(t, 2));
        setMultiplier(m);
        setPositions((prev) => [...prev, { x, y }]);

        if (y > 400) {
          clearInterval(flightInterval);
          handleCrash(m);
        }
      }, 100);

      const crashTime = Math.floor(Math.random() * 12000);
      const crashTimeout = setTimeout(() => {
        clearInterval(flightInterval);
        handleCrash(multiplier);
      }, crashTime);

      return () => {
        clearInterval(flightInterval);
        clearTimeout(crashTimeout);
      };
    } else {
      setPositions([]);
    }
  }, [isFlying]);

  const handleCrash = async (multiplierValue) => {
    setIsFlying(false);
    setGameStarted(false);
    await resolveBet({
      betId,
      win: false,
      multiplier: multiplierValue,
      playWin,
      playLose,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });
    setStatusMessage("The plane crashed!");
  };

  const handlePlaceBet = async () => {
    const result = await placeBet({
      bet,
      setBetId,
      playCoin,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    if (result.success) {
      setIsFlying(true);
      setIsVisible(true);
      setGameStarted(true);
    } else {
      setStatusMessage(result.message);
    }
  };

  const cashOut = async () => {
    if (isFlying) {
      const winnings = Math.floor(bet * multiplier);
      setGameStarted(false);
      setStatusMessage(
        `Cashed out: ${multiplier.toFixed(2)}x, You won ${winnings.toFixed(2)} credits!`
      );
      await resolveBet({
        betId,
        win: true,
        multiplier,
        playWin,
        playLose,
        updateCredits: () => updateCredits(navbarRef, setCredits),
      });
      setMultiplier(1.0);
      setPositions([]);
    } else {
      setStatusMessage("There is no active game!");
    }
  };

  const pathData = positions
    .map((pos, i) => `${i === 0 ? "M" : "L"} ${pos.x} ${400 - pos.y}`)
    .join(" ");
  const rotation = Math.min(60, multiplier * 10);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-aviatorbg font-['Press Start 2P'] text-white px-4">
        <div className="flex flex-col items-center justify-center p-10 backdrop-blur-lg rounded-3xl">
          <div className="text-xl sm:text-2xl font-bold text-white drop-shadow text-center">
            Multiplier: <span className="text-green-500">{multiplier.toFixed(2)}x</span>
          </div>

          <div className="relative w-[300px] h-[400px] bg-aviatorgamebg bg-opacity-0 rounded-xl overflow-hidden border-4 border-slate-800 mb-6">
            <svg className="absolute w-full h-full">
              <path d={pathData} stroke="red" strokeWidth="3" fill="transparent" />
            </svg>

            {isVisible && (
              <div
                className={`absolute transition-all duration-100 ${isFlying ? "" : "animate-fall"}`}
                onAnimationEnd={() => setIsVisible(false)}
                style={{
                  left: `${positions[positions.length - 1]?.x - rotation / 3}px`,
                  bottom: `${positions[positions.length - 1]?.y}px`,
                  transform: `rotate(-${rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                <img src="airplane.png" alt="✈️" className="w-10 h-auto" />
              </div>
            )}
          </div>

          <div className="flex flex-row gap-4 mb-4 items-center">
            <button
              onClick={handlePlaceBet}
              disabled={isFlying}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-transform duration-300 ${
                isFlying
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:-translate-y-1 hover:bg-blue-800"
              }`}
            >
              Place Bet
            </button>

            <button
              onClick={cashOut}
              disabled={!isFlying || !gameStarted}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-transform duration-300 ${
                !isFlying
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:-translate-y-1 hover:bg-green-800"
              }`}
            >
              Cash Out
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="p-2 bg-gray-900 text-white rounded-lg shadow-md text-sm font-bold"
            >
              {[10, 20, 50, 100, 200, 500, 1000].map((amount) => (
                <option
                  key={amount}
                  value={amount}
                  disabled={credits < amount}
                  className={credits < amount ? "text-gray-500" : ""}
                >
                  {amount} Credits
                </option>
              ))}
            </select>
            <img src={`/chips/${bet}.png`} alt={`${bet} chip`} className="w-10 h-10" />
          </div>

          <div className="absolute my-auto p-6">
            {statusMessage && (
              <div
                className={`message-container p-4 rounded-xl ${
                  fade ? "fade-in" : "fade-out"
                } ${
                  statusMessage.includes("crashed")
                    ? "text-red-600"
                    : statusMessage.includes("won")
                    ? "text-green-600"
                    : statusMessage.includes("tie")
                    ? "text-gray-800"
                    : "text-yellow-500"
                }`}
                style={{ transition: "all 0.5s ease" }}
              >
                <h2 className="text-center text-4xl">{statusMessage}</h2>
              </div>
            )}
          </div>

          <style>
            {`
              @keyframes fall {
                from { transform: translateY(${positions[positions.length - 1]?.y}px); }
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
