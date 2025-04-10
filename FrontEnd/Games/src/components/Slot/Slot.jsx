import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';

const SYMBOLS = ['🍎', '🍋', '🍇', '🍒', '💎', '7️⃣'];
const BET_AMOUNTS = [10, 20, 50, 100];

const SlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState(['🍎', '🍋', '🍇']);
  const [currentBet, setCurrentBet] = useState(BET_AMOUNTS[0]);
  const [winningPositions, setWinningPositions] = useState([false, false, false]);
  const navbarRef = useRef();
  const [betId, setBetId] = useState(null);

  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  const checkWin = (results) => {
    const newWinningPositions = [false, false, false];
    if (results[0] === results[1] && results[1] === results[2]) {
      newWinningPositions.fill(true);
      setWinningPositions(newWinningPositions);
      return currentBet * 5;
    } else if (results[0] === results[1]) {
      newWinningPositions[0] = true;
      newWinningPositions[1] = true;
      setWinningPositions(newWinningPositions);
      return currentBet * 2;
    } else if (results[1] === results[2]) {
      newWinningPositions[1] = true;
      newWinningPositions[2] = true;
      setWinningPositions(newWinningPositions);
      return currentBet * 2;
    } else if (results[0] === results[2]) {
      newWinningPositions[0] = true;
      newWinningPositions[2] = true;
      setWinningPositions(newWinningPositions);
      return currentBet * 2;
    }
    setWinningPositions([false, false, false]);
    return -currentBet;
  };

  const placeBet = async () => {
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
            amount: currentBet,
          },
        }
      );
      navbarRef.current?.refreshCredits();  
      const match = response.data.match(/Bet ID: (\d+)/);
      const id = match ? parseInt(match[1]) : null;
      if (id) setBetId(id);
    } catch (err) {
      console.error("Failed to place bet", err);
    }
  };

  const resolveBet = async (win, multiplier = 1) => {
    if (!betId) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:1010/api/resolve/${betId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { win, multiplier },
        }
      );
      if (navbarRef.current?.refreshCredits) navbarRef.current.refreshCredits();
    } catch (err) {
      console.error("Resolve bet error", err);
    }
  };

  const spin = async () => {
    setWinningPositions([false, false, false]);
    await placeBet();
    setIsSpinning(true);
    const spinDurations = [20, 25, 30];
    const finalSymbols = ['', '', ''];
    let completedSpins = 0;

    spinDurations.forEach((duration, index) => {
      let count = 0;
      const interval = setInterval(() => {
        const newSymbol = getRandomSymbol();
        setSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = newSymbol;
          return newSlots;
        });
        count++;
        if (count === duration) {
          clearInterval(interval);
          finalSymbols[index] = newSymbol;
          completedSpins++;
          if (completedSpins === 3) {
            setTimeout(() => {
              const winAmount = checkWin(finalSymbols);
              resolveBet(winAmount > 0, winAmount / currentBet);
              setIsSpinning(false);
            }, 500);
          }
        }
      }, 100);
    });
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="w-screen h-screen bg-fixed bg-center bg-slotbg flex items-center relative font-sans pt-16">
        <div className="max-w-[20%] mx-auto text-center py-[20%]">
          <div className="flex justify-center gap-[70px] mb-[270px] mt-[-5%]">
            {slots.map((symbol, index) => (
              <div
                key={index}
                className={`w-full h-[120px] rounded-xl flex items-center justify-center text-[60px] ${
                  winningPositions[index] ? 'bg-green-500/70 border-3 border-green-500 animate-pulse' : ''
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="my-2.5 flex items-center gap-2.5 text-gray-100">
              <label>Select Bet:</label>
              <select
                value={currentBet}
                onChange={(e) => setCurrentBet(Number(e.target.value))}
                disabled={isSpinning}
                className="p-1.5 text-base rounded bg-gray-800 text-gray-100 border-2 border-gray-900"
              >
                {BET_AMOUNTS.map((amount) => (
                  <option key={amount} value={amount}>
                    {amount} credits
                  </option>
                ))}
              </select>
            </div>

            <button
              className="py-4 px-10 text-xl bg-red-600 text-white border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
              onClick={spin}
              disabled={isSpinning}
            >
              {isSpinning ? 'SPINNING...' : `SPIN!`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlotMachine;
