import { useState, useEffect } from 'react';

export const useFlightLogic = (initialMultiplier = 1.0, onCrash) => {
  const [multiplier, setMultiplier] = useState(initialMultiplier);
  const [positions, setPositions] = useState([]);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    if (!isFlying) {
      setPositions([]);
      return;
    }

    let x = 0, y = 0, m = initialMultiplier;
    const startTime = Date.now();

    const interval = setInterval(() => {
      m = parseFloat((m * 1.01).toFixed(4));
      const t = (Date.now() - startTime) / 1000;
      x = x * 1.00001 + 1;
      y = Math.max(0, 0.5 * Math.pow(t, 2));
      setMultiplier(m);
      setPositions((prev) => [...prev, { x, y }]);
      if (y > 400) {
        clearInterval(interval);
        onCrash(m);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onCrash(m);
    }, Math.floor(Math.random() * 12000));

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isFlying]);

  return {
    multiplier,
    positions,
    isFlying,
    setIsFlying,
    setMultiplier,
    setPositions,
  };
};
