import React, { useState } from 'react';
import './Slot.css';

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
    <div className="slot-machine-page">
      <button 
        className="exit-button" 
        onClick={handleExit}
        disabled={isSpinning}
      >
        EXIT
      </button>
      
      <div className="slot-machine">
      <div className="slots">
        {slots.map((symbol, index) => (
          <div 
            key={index} 
            className={`slot ${winningPositions[index] ? 'winning' : ''}`}
          >
            {symbol}
          </div>
        ))}
        </div>
        <div className="controls">
          <div className="credits">Credits: {credits}</div>
          <div className="bet-selector">
            <label>Select Bet:</label>
            <select 
              value={currentBet} 
              onChange={(e) => setCurrentBet(Number(e.target.value))}
              disabled={isSpinning}
            >
              {BET_AMOUNTS.map((amount) => (
                <option key={amount} value={amount}>
                  {amount} credits
                </option>
              ))}
            </select>
          </div>
          <button 
            className="spin-button" 
            onClick={spin} 
            disabled={isSpinning || credits < currentBet}
          >
            {isSpinning ? 'SPINNING...' : `SPIN! (${currentBet} credits)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;