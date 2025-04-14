import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import useSound from "use-sound";
import coinSound from "../assets/sounds/coin.wav";
import winSound from "../assets/sounds/win.mp3";
import loseSound from "../assets/sounds/lose.mp3";
import axios from "axios";

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

  const navbarRef = useRef();

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
          resolveBet(false, multiplier);
          setStatusMessage("The plane crashed!");
        }
      }, 100);

      const randomFlightDuration = Math.floor(Math.random() * 12000);

      setTimeout(() => {
        clearInterval(flightInterval);
        setIsFlying(false);
        setGameStarted(false);
        resolveBet(false, multiplier);
        setStatusMessage("The plane crashed!");
      }, randomFlightDuration);
    } else {
      setPositions([]);
    }

    return () => clearInterval(flightInterval);
  }, [isFlying]);

  const placeBet = async () => {
    if (bet <= 0) {
      setStatusMessage("Invalid bet amount!");
      return;
    }

    const token = localStorage.getItem("token");
    try {
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

      const match = response.data.match(/Bet ID: (\d+)/);
      const id = match ? parseInt(match[1]) : null;
      if (id) setBetId(id);

      navbarRef.current?.refreshCredits();
      playCoin();
      setIsFlying(true);
      setIsVisible(true);
      setGameStarted(true);
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Bet failed.");
    }
  };

  const resolveBet = async (win, multiplierValue) => {
    if (!betId) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:1010/api/resolve/${betId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            win: win,
            multiplier: multiplierValue,
          },
        }
      );
      if (navbarRef.current?.refreshCredits) {
        navbarRef.current.refreshCredits();
      }
      if (win) {
        playWin();
        setStatusMessage(
          `Cashed out: ${multiplierValue.toFixed(2)}x, You won ${Math.floor(
            bet * multiplierValue
          )} credits!`
        );
      } else {
        playLose();
        setStatusMessage("The plane crashed!");
      }
    } catch (error) {
      console.error("ResolveBet error:", error);
    }
  };

  const cashOut = () => {
    if (isFlying) {
      const winnings = Math.floor(bet * multiplier);
      setGameStarted(false);
      setStatusMessage(
        `Cashed out: ${multiplier.toFixed(2)}x, You won ${winnings.toFixed(
          2
        )} credits!`
      );
      resolveBet(true, multiplier);
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
      <Navbar ref={navbarRef} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-aviatorbg font-['Press Start 2P'] text-white px-4">
        <div className="flex flex-col items-center justify-center p-10 backdrop-blur-lg rounded-3xl">
        <div className="text-xl sm:text-2xl font-bold text-white drop-shadow text-center">
            Multiplier: <span className="text-green-500">{multiplier.toFixed(2)}x</span>
          </div>
          <div className="relative w-[300px] h-[400px] bg-aviatorgamebg bg-opacity-0 rounded-xl overflow-hidden border-4 border-slate-800 mb-6">
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

          <div className="flex flex-row sm:flex-row gap-4 mb-4 items-center">
            <button
              onClick={placeBet}
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
              disabled={gameStarted}
              className="p-2 bg-gray-900 white rounded-lg shadow-md text-sm font-bold"
            >
              {[10, 20, 50, 100, 200, 500, 1000].map((amount) => (
                <option key={amount} value={amount}>
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
          

          <div className="absolute my-auto p-6">
          {statusMessage && (
            <div
              className={`message-container p-4 rounded-xl ${
                fade ? "fade-in" : "fade-out"
              } 
                        ${
                          statusMessage.includes("crashed")
                            ? "text-red-600   "
                            : statusMessage.includes("won")
                            ? "text-green-600 "
                            : statusMessage.includes("tie")
                            ? "text-gray-800 "
                            : "text-yellow-500 "
                        }`}
              style={{ transition: "all 0.5s ease" }}
            >
              <h2 className="text-center text-4xl ">{statusMessage}</h2>
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
