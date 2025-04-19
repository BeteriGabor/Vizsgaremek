import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import useSound from 'use-sound';
import coinSound from '../components/assets/sounds/coin.wav';
import winSound from '../components/assets/sounds/win.mp3';
import loseSound from '../components/assets/sounds/lose.mp3';
import { placeBet } from '../utils/placeBets';
import { resolveBet } from '../utils/resolveBet';
import { updateCredits } from '../utils/updateCredits';

const SYMBOLS = [
  '/emoji/apple.png',
  '/emoji/lemon.png',
  '/emoji/grape.png',
  '/emoji/cherry.png',
  '/emoji/diamond.png',
  '/emoji/7.png',
];

const SlotMachine = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState(SYMBOLS.slice(0, 3));
  const [bet, setBet] = useState(10);
  const [winningPositions, setWinningPositions] = useState([false, false, false]);
  const [betId, setBetId] = useState(null);
  const [credits, setCredits] = useState(0);
  const navbarRef = useRef();

  useEffect(() => {
    updateCredits(navbarRef, setCredits);
  }, []);

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  const checkWin = (results) => {
    const newWinningPositions = [false, false, false];
    if (results[0] === results[1] && results[1] === results[2]) {
      newWinningPositions.fill(true);
      setWinningPositions(newWinningPositions);
      return 3;
    } else if (results[0] === results[1]) {
      newWinningPositions[0] = newWinningPositions[1] = true;
      setWinningPositions(newWinningPositions);
      return 2;
    } else if (results[1] === results[2]) {
      newWinningPositions[1] = newWinningPositions[2] = true;
      setWinningPositions(newWinningPositions);
      return 2;
    } else if (results[0] === results[2]) {
      newWinningPositions[0] = newWinningPositions[2] = true;
      setWinningPositions(newWinningPositions);
      return 2;
    }
    setWinningPositions([false, false, false]);
    return 0;
  };

  const spin = async () => {
    setWinningPositions([false, false, false]);

    const result = await placeBet({
      bet,
      setBetId,
      playCoin,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    if (!result.success) return;

    setIsSpinning(true);
    const spinDurations = [20, 25, 30];
    const finalSymbols = ['', '', ''];
    let completedSpins = 0;

    spinDurations.forEach((duration, index) => {
      let count = 0;
      const interval = setInterval(() => {
        const newSymbol = getRandomSymbol();
        setSlots((prev) => {
          const updated = [...prev];
          updated[index] = newSymbol;
          return updated;
        });
        count++;
        if (count === duration) {
          clearInterval(interval);
          finalSymbols[index] = newSymbol;
          completedSpins++;

          if (completedSpins === 3) {
            setTimeout(() => {
              const winMultiplier = checkWin(finalSymbols);
              resolveBet({
                betId,
                win: winMultiplier > 0,
                multiplier: winMultiplier,
                playWin,
                playLose,
                updateCredits: () => updateCredits(navbarRef, setCredits),
              });
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
                  <img
                    src={symbol}
                    alt="symbol"
                    className="w-full h-full object-contain"
                  />
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
