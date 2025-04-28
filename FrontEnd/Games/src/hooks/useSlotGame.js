import { useState } from "react";
import { placeBet } from "../utils/placeBets";
import { resolveBet } from "../utils/resolveBet";
import { updateCredits } from "../utils/updateCredits";

const SYMBOLS = [
  "/emoji/apple.png",
  "/emoji/lemon.png",
  "/emoji/grape.png",
  "/emoji/cherry.png",
  "/emoji/diamond.png",
  "/emoji/7.png",
];

export const useSlotGame = ({ playCoin, playWin, playLose, navbarRef }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState(SYMBOLS.slice(0, 3));
  const [winningPositions, setWinningPositions] = useState([false, false, false]);
  const [bet, setBet] = useState(10);
  const [credits, setCredits] = useState(0);

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  const checkWin = (results) => {
    const newWinning = [false, false, false];
    if (results[0] === results[1] && results[1] === results[2]) {
      newWinning.fill(true);
      setWinningPositions(newWinning);
      return 3;
    } else if (results[0] === results[1]) {
      newWinning[0] = newWinning[1] = true;
    } else if (results[1] === results[2]) {
      newWinning[1] = newWinning[2] = true;
    } else if (results[0] === results[2]) {
      newWinning[0] = newWinning[2] = true;
    }
    setWinningPositions(newWinning);
    return newWinning.includes(true) ? 2 : 0;
  };

  const spin = async () => {
    setWinningPositions([false, false, false]);

    const result = await placeBet({
      bet,
      setBetId: () => {}, // nem használjuk, csak belsőleg kell a visszaadott ID
      playCoin,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    const currentBetId = result.betId;

    if (!result.success || !currentBetId) {
      console.error("❌ No betId provided!");
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
                betId: currentBetId,
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

  return {
    isSpinning,
    slots,
    winningPositions,
    bet,
    credits,
    setBet,
    setCredits,
    spin,
  };
};