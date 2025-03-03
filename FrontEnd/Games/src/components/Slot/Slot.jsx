import React, { useState } from 'react';
import './Slot.css';

const SYMBOLS = ['🍎', '🍋', '🍇', '🍒', '💎', '7️⃣'];

const SlotMachine = () => {
  const [credits, setCredits] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState(['🍎', '🍋', '🍇']);

  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  const checkWin = (results) => {
    if (results[0] === results[1] && results[1] === results[2]) {
      return 50;
    } else if (results[0] === results[1] || results[1] === results[2]) {
      return 10;
    }
    return -5;
  };

  const spin = () => {
    if (credits < 5) {
      alert('Not enough credits!');
      return;
    }

    setIsSpinning(true);

    const spinDurations = [20, 25, 30];
    const finalSymbols = [];

    spinDurations.forEach((duration, index) => {
      let count = 0;
      const interval = setInterval(() => {
        setSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = getRandomSymbol();
          return newSlots;
        });

        count++;
        if (count === duration) {
          clearInterval(interval);
          finalSymbols[index] = slots[index];

          if (index === 2) {
            setTimeout(() => {
              const winAmount = checkWin(slots);
              setCredits(prev => prev + winAmount);
              setIsSpinning(false);
            }, 500);
          }
        }
      }, 100);
    });
  };

  return (
    <>
      <div className="slot-machine-page">
        <div className="slot-machine">
          <div className="slots">
            {slots.map((symbol, index) => (
              <div key={index} className="slot">
                {symbol}
              </div>
          ))}
        </div>
        <div className="controls">
          <div className="credits">Credits: {credits}</div>
            <button 
              className="spin-button" 
              onClick={spin} 
              disabled={isSpinning || credits < 10}
            >
              {isSpinning ? 'SPINNING...' : 'SPIN! (10 credits)'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlotMachine;