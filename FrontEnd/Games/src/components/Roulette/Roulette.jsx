import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import useSound from 'use-sound';
import coinSound from '../assets/sounds/coin.wav';
import winSound from '../assets/sounds/win.mp3';
import loseSound from '../assets/sounds/lose.mp3';
const Roulette = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState('number');
  const [betNumber, setBetNumber] = useState('');
  const [winningsMessage, setWinningsMessage] = useState({ text: '', type: '' });
  const [betId, setBetId] = useState(null);
  const wheelRef = useRef(null);
  const navbarRef = useRef();
  const [credits, setCredits] = useState(0);


  useEffect(() => {
    updateCredits();
  }, []);
  


  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
    10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  const getTextColor = (number) => {
    if (number === 0) return 'text-green-600';
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)
      ? 'text-red-600'
      : 'text-black';
  };

  const updateCredits = async () => {
    if (navbarRef.current?.refreshCredits && navbarRef.current?.getCredits) {
      await navbarRef.current.refreshCredits();
      setTimeout(() => {
        const updatedCredits = navbarRef.current.getCredits();
        setCredits(updatedCredits);
      }, 100); 
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
          params: { amount: betAmount },
        }
      );
      await updateCredits();
      const match = response.data.match(/Bet ID: (\d+)/);
      const id = match ? parseInt(match[1]) : null;
      if (id) setBetId(id);
      playCoin();
    } catch (err) {
      setWinningsMessage({ text: `Not Enough Credits`, type: 'lose' });
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
      await updateCredits();
    } catch (err) {
      setWinningsMessage({ text: `Not Enough Credits`, type: 'lose' });
    }
  };

  const spinWheel = async () => {
    const bet = parseInt(betAmount);
  
    if (
      spinning ||
      bet <= 0 ||
      credits < bet ||
      (betType === 'number' && (betNumber === '' || betNumber < 0 || betNumber > 36))
    ) {
      setWinningsMessage({ text: "Please select a valid bet, number, or check your credits!", type: 'lose' });
      return;
    }
  
    await placeBet();
    setSpinning(true);
    setResult(null);
    setWinningsMessage({ text: '', type: '' });
  
    const fullRotations = 3 + Math.floor(Math.random() * 8);
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const rotationDegrees = fullRotations * 360 + (randomIndex * (360 / numbers.length));
  
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${rotationDegrees}deg)`;
      wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.15, 1)';
    }
  
    setTimeout(() => {
      setSpinning(false);
      const degreesPerNumber = 360 / numbers.length;
      const normalizedDegrees = rotationDegrees % 360;
      const indexAtPointer = Math.round(normalizedDegrees / degreesPerNumber) % numbers.length;
      const resultIndex = (numbers.length - indexAtPointer) % numbers.length;
      const winningNumber = numbers[resultIndex];
      setResult(winningNumber);
      handleBetOutcome(winningNumber);
    }, 5000);
  };
  

  const handleBetOutcome = (winningNumber) => {
    let winnings = 0;
    const bet = parseInt(betAmount);

    if (betType === 'number' && betNumber == winningNumber) {
      winnings = bet * 35;
    } else if (betType === 'red' && getTextColor(winningNumber) === 'text-red-600') {
      winnings = bet * 2;
    } else if (betType === 'black' && getTextColor(winningNumber) === 'text-black') {
      winnings = bet * 2;
    } else if (betType === 'even' && winningNumber % 2 === 0 && winningNumber !== 0) {
      winnings = bet * 2;
    } else if (betType === 'odd' && winningNumber % 2 !== 0) {
      winnings = bet * 2;
    } else if (betType === 'high' && winningNumber >= 19) {
      winnings = bet * 2;
    } else if (betType === 'low' && winningNumber >= 1 && winningNumber <= 18) {
      winnings = bet * 2;
    }

    resolveBet(winnings > 0, winnings / bet);

    if (winnings > 0) {
      playWin();
      setWinningsMessage({ text: `You won ${winnings} credits!`, type: 'win' });
    } else {
      playLose();
      setWinningsMessage({ text: 'You lost', type: 'lose' });
    }
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="flex flex-col items-center p-5 bg-blackjackbg  h-screen pt-[10%] overflow-hidden ">
        <div className="flex flex-col items-center p-5">
          <div className="relative w-[300px] h-[300px] mb-8">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500 z-10"></div>
            <div
              ref={wheelRef}
              className={`relative w-[300px] h-[300px] rounded-full bg-roulette bg-cover ${spinning ? '' : 'transition-none'}`}
            >
              {numbers.map((number, index) => {
                const rotation = index * (360 / numbers.length);
                return (
                  <div
                    key={index}
                    className={`absolute w-[30px] h-[30px] top-1/2 left-1/2 -ml-[15px] -mt-[15px] text-center leading-[30px] rounded-full text-white font-bold text-xs`}
                    style={{
                      transform: `rotate(${rotation}deg) translateY(-125px) rotate(-${rotation}deg)`,
                    }}
                  >
                    {number}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center">
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

            {result !== null && (
              <div className="text-lg font-bold text-white">
                Result: <span className={getTextColor(result)}>{result}</span>
              </div>
            )}
            
          </div>
          <div className='absolute text-4xl top-1/3  p-4'>
            {winningsMessage.text && (
              <div className={` ${winningsMessage.type === 'win' ? 'text-green-600 backdrop-blur-md' : 'text-red-600 backdrop-blur-md'}`}>
                {winningsMessage.text}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center mt-4">
          <select
            onChange={(e) => setBetType(e.target.value)}
            className={`ml-3 p-2 text-white rounded mb-2 md:mb-0 
              ${betType === 'red' ? 'bg-red-600' :
                betType === 'black' ? 'bg-black' : 'bg-gray-900'}`}
            value={betType}
          >
            <option value="number" className='bg-gray-900'>Specific Number</option>
            <option value="red" className='bg-red-600'>Red</option>
            <option value="black" className='bg-black'>Black</option>
            <option value="even" className='bg-gray-900'>Even</option>
            <option value="odd" className='bg-gray-900'>Odd</option>
            <option value="high" className='bg-gray-900'>19-36</option>
            <option value="low" className='bg-gray-900'>1-18</option>
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
      </div>
    </>
  );
};

export default Roulette;
