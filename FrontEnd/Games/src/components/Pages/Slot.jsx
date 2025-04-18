import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Pages/Navbar';
import usePlaySound from '../Hooks/usePlaySound/usePlaySound';
import coinSound from '../assets/sounds/coin.wav';
import winSound from '../assets/sounds/win.mp3';
import loseSound from '../assets/sounds/lose.mp3';
import axios from 'axios';

const SYMBOLS = [
                <img src="/emoji/apple.png" alt="🍎" className="w-full h-full object-contain" />,
                <img src="/emoji/lemon.png" alt="🍋" className="w-full h-full object-contain" />,
                <img src="/emoji/grape.png" alt="🍇" className="w-full h-full object-contain" />,
                <img src="/emoji/cherry.png" alt="🍒" className="w-full h-full object-contain" />,
                <img src="/emoji/diamond.png" alt="💎" className="w-full h-full object-contain" />,
                <img src="/emoji/7.png" alt="7️⃣" className="w-full h-full object-contain" />,
              ];

const SlotMachine = () => {
  const [playCoin] = usePlaySound(coinSound);
  const [playWin] = usePlaySound(winSound);
  const [playLose] = usePlaySound(loseSound);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState([<img src="/emoji/apple.png" alt="🍎" />, <img src="/emoji/lemon.png" alt="🍋" />, <img src="/emoji/grape.png" alt="🍇" />]);
  const [bet, setBet] = useState([10]);
  const [winningPositions, setWinningPositions] = useState([false, false, false]);
  const navbarRef = useRef();
  const [betId, setBetId] = useState(null);
  const [credits, setCredits] = useState(0);

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  const checkWin = (results) => {
    const newWinningPositions = [false, false, false];
    if (results[0] === results[1] && results[1] === results[2]) {
      newWinningPositions.fill(true);
      setWinningPositions(newWinningPositions);
      return bet * 3;
    } else if (results[0] === results[1]) {
      newWinningPositions[0] = true;
      newWinningPositions[1] = true;
      setWinningPositions(newWinningPositions);
      return bet * 2;
    } else if (results[1] === results[2]) {
      newWinningPositions[1] = true;
      newWinningPositions[2] = true;
      setWinningPositions(newWinningPositions);
      return bet * 2;
    } else if (results[0] === results[2]) {
      newWinningPositions[0] = true;
      newWinningPositions[2] = true;
      setWinningPositions(newWinningPositions);
      return bet * 2;
    }
    setWinningPositions([false, false, false]);
    return -bet;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (navbarRef.current?.getCredits) {
        setCredits(navbarRef.current.getCredits());
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const updateCredits = async () => {
    if (navbarRef.current?.refreshCredits && navbarRef.current?.getCredits) {
      await navbarRef.current.refreshCredits();
      const updatedCredits = navbarRef.current.getCredits();
      setCredits(updatedCredits);  
    }
  };

  const placeBet = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:1010/auth/place`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { amount: bet },
        }
      );
      navbarRef.current?.refreshCredits();
      updateCredits();  
      const match = response.data.match(/Bet ID: (\d+)/);
      const id = match ? parseInt(match[1]) : null;
      if (id) setBetId(id);
      playCoin();
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
      navbarRef.current?.refreshCredits();
      updateCredits();  
      win ? playWin() : playLose();
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
              resolveBet(winAmount > 0, winAmount / bet);
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
      <div className="w-screen h-screen bg-fixed bg-center bg-slotbg flex items-center relative font-sans pt-16 overflow-hidden">
        <div className="max-w-[20%] mx-auto text-center py-[20%]">
          <div className="flex justify-center gap-[50px] mb-[270px] mt-[-5%]">
            {slots.map((symbol, index) => (
              <div
                key={index}
                className={`w-[100px] h-[100px] min-w-[100px] min-h-[100px] flex items-center justify-center rounded-xl overflow-hidden
                  ${winningPositions[index] ? 'bg-green-500 border-3 border-green-500 animate-pulse' : ''}`}
              >
                <div className="w-[80px] h-[80px] flex items-center justify-center">
                  {symbol}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="mt-4 flex items-center gap-4">
              <select
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={isSpinning}
                className="p-2 bg-gray-900 text-white rounded-lg shadow-md text-sm font-bold"
              >
                {[10, 20, 50, 100, 200, 500, 1000].map(amount => (
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

            <button
              className="py-4 px-10 text-xl bg-red-600 text-white border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
              onClick={spin}
              disabled={isSpinning || bet > credits}
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
