import React, { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import useSound from "use-sound";
import coinSound from "../components/assets/sounds/coin.wav";
import winSound from "../components/assets/sounds/win.mp3";
import loseSound from "../components/assets/sounds/lose.mp3";
import { useSlotGame } from "../hooks/useSlotGame";
import { updateCredits } from "../utils/updateCredits";


const SlotMachine = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);
  const navbarRef = useRef();

  const {
    isSpinning,
    slots,
    winningPositions,
    bet,
    credits,
    setBet,
    setCredits,
    spin,
  } = useSlotGame({
    playCoin,
    playWin,
    playLose,
    navbarRef,
  });

  useEffect(() => {
    updateCredits(navbarRef, setCredits);
  }, []);

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
                ${
                  winningPositions[index]
                    ? "bg-green-500 border-3 border-green-500 animate-pulse"
                    : ""
                }`}
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
              {isSpinning ? "SPINNING..." : `SPIN!`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlotMachine;
