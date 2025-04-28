import { useState, useEffect, useRef } from "react";

export const useRouletteGame = ({
  playCoin,
  playWin,
  playLose,
  updateCredits,
  placeBet,
  resolveBet,
  navbarRef,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState("number");
  const [betNumber, setBetNumber] = useState("");
  const [winningsMessage, setWinningsMessage] = useState({ text: "", type: "" });
  const [betId, setBetId] = useState(null);
  const [credits, setCredits] = useState(0);

  const wheelRef = useRef();

  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
    10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  useEffect(() => {
    updateCredits(navbarRef, setCredits);
  }, []);

  const getTextColor = (number) => {
    if (number === 0) return "text-green-600";
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)
      ? "text-red-600"
      : "text-black";
  };

  const spinWheel = async () => {
    const bet = parseInt(betAmount);

    if (
      spinning ||
      bet <= 0 ||
      credits < bet ||
      (betType === "number" && (betNumber === "" || betNumber < 0 || betNumber > 36))
    ) {
      setWinningsMessage({ text: "Failed to place bet!", type: "lose" });
      return;
    }

    const result = await placeBet({
      bet,
      setBetId,
      playCoin,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    if (!result.success || !result.betId) {
      setWinningsMessage({ text: "Bet failed", type: "lose" });
      return;
    }

    const currentBetId = result.betId;
    setBetId(currentBetId); 

    setSpinning(true);
    setResult(null);
    setWinningsMessage({ text: "", type: "" });

    const fullRotations = 3 + Math.floor(Math.random() * 8);
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const rotationDegrees = fullRotations * 360 + (randomIndex * (360 / numbers.length));

    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${rotationDegrees}deg)`;
      wheelRef.current.style.transition = "transform 5s cubic-bezier(0.17, 0.67, 0.15, 1)";
    }

    setTimeout(() => {
      setSpinning(false);
      const degreesPerNumber = 360 / numbers.length;
      const normalizedDegrees = rotationDegrees % 360;
      const indexAtPointer = Math.round(normalizedDegrees / degreesPerNumber) % numbers.length;
      const resultIndex = (numbers.length - indexAtPointer) % numbers.length;
      const winningNumber = numbers[resultIndex];
      setResult(winningNumber);
      handleBetOutcome(winningNumber, currentBetId);
    }, 5000);
  };

  const handleBetOutcome = (winningNumber, currentBetId) => {
    let winnings = 0;
    const bet = parseInt(betAmount);

    if (betType === "number" && betNumber == winningNumber) {
      winnings = bet * 35;
    } else if (betType === "red" && getTextColor(winningNumber) === "text-red-600") {
      winnings = bet * 2;
    } else if (betType === "black" && getTextColor(winningNumber) === "text-black") {
      winnings = bet * 2;
    } else if (betType === "even" && winningNumber % 2 === 0 && winningNumber !== 0) {
      winnings = bet * 2;
    } else if (betType === "odd" && winningNumber % 2 !== 0) {
      winnings = bet * 2;
    } else if (betType === "high" && winningNumber >= 19) {
      winnings = bet * 2;
    } else if (betType === "low" && winningNumber >= 1 && winningNumber <= 18) {
      winnings = bet * 2;
    }

    resolveBet({
      betId: currentBetId,
      win: winnings > 0,
      multiplier: winnings > 0 ? winnings / bet : 1,
      playWin,
      playLose,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    if (winnings > 0) {
      setWinningsMessage({ text: `You won ${winnings} credits!`, type: "win" });
    } else {
      setWinningsMessage({ text: "You lost", type: "lose" });
    }
  };

  return {
    spinning,
    result,
    betAmount,
    setBetAmount,
    betType,
    setBetType,
    betNumber,
    setBetNumber,
    winningsMessage,
    spinWheel,
    wheelRef,
    getTextColor,
    numbers,
  };
};
