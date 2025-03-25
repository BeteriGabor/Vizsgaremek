import React, { useState } from 'react';

const SYMBOLS = ['🍎', '🍋', '🍇', '🍒', '💎', '7️⃣'];
const BET_AMOUNTS = [10, 20, 50, 100];

const SlotMachine = () => {
  const [credits, setCredits] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState(['🍎', '🍋', '🍇']);
  const [currentBet, setCurrentBet] = useState(BET_AMOUNTS[0]);

  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  const [winningPositions, setWinningPositions] = useState([false, false, false]);

  const checkWin = (results) => {
    const newWinningPositions = [false, false, false];
    
    if (results[0] === results[1] && results[1] === results[2]) {
      newWinningPositions[0] = true;
      newWinningPositions[1] = true;
      newWinningPositions[2] = true;
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

  const spin = () => {
    setWinningPositions([false, false, false]);
    if (credits < currentBet) {
      alert('Not enough credits!');
      return;
    }
  
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
              setCredits(prev => prev + winAmount);
              setIsSpinning(false);
            }, 500);
          }
        }
      }, 100);
    });
  };

  const handleExit = () => {
      window.location.href = '/'; 
  };

  return (
    <div className="w-screen h-screen bg-cover bg-fixed bg-center bg-slotbg flex items-center relative font-sans">
      <button 
        className="fixed top-0 right-0 mt-[1%] mr-[1%] bg-red-600 hover:bg-red-700 text-white border-none rounded-lg cursor-pointer text-lg py-2 px-4 transition-all duration-300 ease-in-out hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
        onClick={handleExit} 
        disabled={isSpinning}
      >
        EXIT
      </button>
      
      <div className="max-w-[20%] mx-auto text-center py-[20%]">
        <div className="flex justify-center gap-[70px] mb-[270px] mt-[20%]">
          {slots.map((symbol, index) => (
            <div 
              key={index} 
              className={`w-full h-[120px] rounded-xl flex items-center justify-center text-[60px] ${
                winningPositions[index] 
                  ? 'bg-green-500/30 border-3 border-green-500 animate-pulse' 
                  : ''
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-2xl text-gray-100 font-bold">
            Credits: {credits}
          </div>
          
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
            disabled={isSpinning || credits < currentBet}
          >
            {isSpinning ? 'SPINNING...' : `SPIN!`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;