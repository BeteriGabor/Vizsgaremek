import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import useSound from 'use-sound';
import coinSound from '../components/assets/sounds/coin.wav';
import winSound from '../components/assets/sounds/win.mp3';
import loseSound from '../components/assets/sounds/lose.mp3';

import { updateCredits } from '../utils/updateCredits';
import { placeBet } from '../utils/placeBets';
import { resolveBet } from '../utils/resolveBet';
import { useRouletteGame } from '../hooks/useRouletteGame';

const Roulette = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);
  const navbarRef = useRef();

  const {
    numbers,
    spinning,
    result,
    betAmount,
    betType,
    betNumber,
    winningsMessage,
    credits,
    wheelRef,
    setBetAmount,
    setBetType,
    setBetNumber,
    spinWheel,
    getTextColor,
  } = useRouletteGame({
    navbarRef,
    playCoin,
    playWin,
    playLose,
    updateCredits,
    placeBet,
    resolveBet,
  });

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="flex flex-col items-center p-5 bg-blackjackbg h-screen pt-[10%] overflow-hidden">
        {/* Wheel */}
        <div className="relative w-[300px] h-[300px] mb-8">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500 z-10" />
          <div
            ref={wheelRef}
            className={`relative w-[300px] h-[300px] rounded-full bg-roulette bg-cover ${spinning ? '' : 'transition-none'}`}
          >
            {numbers.map((number, index) => {
              const rotation = index * (360 / numbers.length);
              return (
                <div
                  key={index}
                  className="absolute w-[30px] h-[30px] top-1/2 left-1/2 -ml-[15px] -mt-[15px] text-center leading-[30px] rounded-full text-white font-bold text-xs"
                  style={{
                    transform: `rotate(${rotation}deg) translateY(-125px) rotate(-${rotation}deg)`
                  }}
                >
                  {number}
                </div>
              );
            })}
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={
            spinning ||
            credits < betAmount ||
            (betType === 'number' && (betNumber === '' || betNumber < 0 || betNumber > 36))
          }
          className={`px-5 py-2.5 ${spinning ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded mb-4 font-medium`}
        >
          {spinning ? 'Spinning...' : 'Spin'}
        </button>

        {/* Result */}
        {result !== null && (
          <div className="text-lg font-bold text-white">
            Result: <span className={getTextColor(result)}>{result}</span>
          </div>
        )}

        {/* Win/Lose Message */}
        {winningsMessage.text && (
          <div className={`absolute text-4xl top-1/3 p-4 ${winningsMessage.type === 'win' ? 'text-green-600' : 'text-red-600'} backdrop-blur-md`}>
            {winningsMessage.text}
          </div>
        )}

        {/* Bet Settings */}
        <div className="flex flex-wrap items-center justify-center mt-4">
          <select
            onChange={(e) => setBetType(e.target.value)}
            value={betType}
            className={`ml-3 p-2 text-white rounded mb-2 md:mb-0 
              ${betType === 'red' ? 'bg-red-600' :
                betType === 'black' ? 'bg-black' : 'bg-gray-900'}`}
          >
            <option value="number">Specific Number</option>
            <option value="red">Red</option>
            <option value="black">Black</option>
            <option value="even">Even</option>
            <option value="odd">Odd</option>
            <option value="high">19-36</option>
            <option value="low">1-18</option>
          </select>

          {betType === 'number' && (
            <input
              type="number"
              placeholder="Number (0-36)"
              value={betNumber}
              onChange={(e) => setBetNumber(e.target.value)}
              className="ml-3 p-2 bg-gray-900 text-white rounded"
            />
          )}
        </div>

        {/* Bet Amount */}
        <div className="mt-4 flex items-center gap-4">
          <select
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            disabled={spinning}
            className="p-2 bg-gray-900 text-white rounded-lg shadow-md text-sm font-bold"
          >
            {[10, 20, 50, 100, 200, 500, 1000].map(amount => (
              <option
                key={amount}
                value={amount}
                disabled={credits < amount}
                className={credits < amount ? 'text-gray-500' : ''}
              >
                {amount} Credits
              </option>
            ))}
          </select>
          <img
            src={`/chips/${betAmount}.png`}
            alt={`${betAmount} chip`}
            className="w-10 h-10"
          />
        </div>
      </div>
    </>
  );
};

export default Roulette;
