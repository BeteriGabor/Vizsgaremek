import { useState, useEffect } from "react";
import { placeBet } from "../utils/placeBets";
import { resolveBet } from "../utils/resolveBet";
import { updateCredits } from "../utils/updateCredits";

export const useChickenGame = ({ playCoin, playWin, playLose, navbarRef }) => {
  const [position, setPosition] = useState(0);
  const [obstacle, setObstacle] = useState(Math.floor(Math.random() * 10) + 1);
  const [gameOver, setGameOver] = useState(false);
  const [carVisible, setCarVisible] = useState(false);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [playerWon, setPlayerWon] = useState(false);
  const [betId, setBetId] = useState(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    updateCredits(navbarRef, setCredits);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setMultiplier(position * 0.5 + 1);
    }
  }, [position, gameStarted, gameOver]);

  const handlePlaceBet = async () => {
    if (bet <= 0) {
      setMessage("Invalid bet amount!");
      return;
    }

    const result = await placeBet({
      bet,
      setBetId,
      playCoin,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    if (!result.success) {
      setMessage("Bet failed.");
      return;
    }

    resetGame();
    setGameStarted(true);
    setMessage("");
    setPlayerWon(false);
  };

  const handleResolveBet = async (win, multiplierValue) => {
    await resolveBet({
      betId,
      win,
      multiplier: multiplierValue,
      playWin,
      playLose,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    if (win) {
      setMessage(`${(bet * multiplierValue).toFixed(2)} credits!`);
    } else {
      setMessage(`You lost your bet of ${bet} credits.`);
    }
  };

  const handleStep = () => {
    if (!gameOver && gameStarted) {
      const newPosition = position + 1;
      setPosition(newPosition);

      if (newPosition === obstacle && obstacle !== 11) {
        setGameOver(true);
        setCarVisible(true);
        setPlayerWon(false);
        handleResolveBet(false, multiplier);
      } else if (newPosition === 11) {
        setGameOver(true);
        setPlayerWon(true);
        handleResolveBet(true, multiplier * 1.5);
      }
    }
  };

  const handleCashOut = () => {
    if (!gameStarted || gameOver) return;
    setMessage(`You cashed out with ${(bet * multiplier).toFixed(2)} credits!`);
    setPlayerWon(true);
    setGameStarted(false);
    setGameOver(true);
    handleResolveBet(true, multiplier);
  };

  const resetGame = () => {
    const newObstacle = Math.floor(Math.random() * 11) + 1;
    setPosition(0);
    setObstacle(newObstacle);
    setGameOver(false);
    setCarVisible(false);
    setMultiplier(1);
  };

  return {
    position,
    carVisible,
    gameOver,
    bet,
    credits,
    message,
    multiplier,
    gameStarted,
    playerWon,
    setBet,
    handlePlaceBet,
    handleCashOut,
    handleStep,
    resetGame,
    setCredits,
  };
};
