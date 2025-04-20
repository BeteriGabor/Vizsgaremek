import React, { useRef } from "react";
import useSound from "use-sound";
import Navbar from "../components/Navbar";
import coinSound from "../components/assets/sounds/coin.wav";
import winSound from "../components/assets/sounds/win.mp3";
import loseSound from "../components/assets/sounds/lose.mp3";
import { updateCredits } from "../utils/updateCredits";
import { placeBet } from "../utils/placeBets";
import { resolveBet } from "../utils/resolveBet";
import { useBlackjackGame } from "../hooks/useBlackjackGame";
import { useStatusMessage } from "../hooks/useStatusMessage";

const Blackjack = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);
  const navbarRef = useRef();

  const {
    deck,
    playerHand,
    dealerHand,
    gameOver,
    gameActive,
    bet,
    betId,
    credits,
    setBet,
    startGame,
    hit,
    stand,
    calculateScore,
    getCardImage,
    getCardValue,
  } = useBlackjackGame({
    playCoin,
    playWin,
    playLose,
    navbarRef,
    updateCredits,
    placeBet,
    resolveBet,
  });

  const { message, fade, setMessage } = useStatusMessage();

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-blackjackbg bg-cover overflow-auto">
        {/* Dealer */}
        <div className="flex flex-wrap justify-center space-x-4 mb-4 w-full max-w-5xl px-4 mt-20">
          <div className="dealer-box p-4 border-2 border-gray-700 bg-green-950 rounded-xl shadow-lg w-full md:w-1/2 lg:w-1/3">
            <h2 className="text-xl text-center text-white">Dealer's Hand:</h2>
            <div className="flex justify-center flex-wrap gap-2">
              {dealerHand.map((card, index) =>
                gameOver || index === 0 ? (
                  <img
                    key={index}
                    src={getCardImage(card.rank, card.suit)}
                    alt={`${card.suit} ${card.rank}`}
                    className="w-20 h-32"
                  />
                ) : (
                  <img
                    key={index}
                    src={require("../components/assets/cards/Card Back 3.png")}
                    alt="Card Back"
                    className="w-20 h-32"
                  />
                )
              )}
            </div>
            <p className="text-xl text-center text-white">
              Dealer's Score:{" "}
              {gameOver ? calculateScore(dealerHand) : dealerHand[0] ? getCardValue(dealerHand[0]) : 0}
            </p>
          </div>

          {/* Player */}
          <div className="player-box p-4 border-2 border-gray-700 bg-green-950 rounded-xl shadow-lg w-full md:w-1/2 lg:w-1/3">
            <h2 className="text-xl text-center text-white">Your Hand:</h2>
            <div className="flex justify-center flex-wrap gap-2">
              {playerHand.map((card, index) => (
                <img
                  key={index}
                  src={getCardImage(card.rank, card.suit)}
                  alt={`${card.suit} ${card.rank}`}
                  className="w-20 h-32"
                />
              ))}
            </div>
            <p className="text-xl text-center text-white">
              Your Score: {calculateScore(playerHand)}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-container flex justify-center space-x-4 mb-6 w-full max-w-3xl px-4">
          <button
            onClick={() => hit(setMessage)}
            disabled={gameOver || playerHand.length === 0}
            className={`bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-opacity ${
              gameOver || playerHand.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Hit
          </button>
          <button
            onClick={() => stand(setMessage)}
            disabled={gameOver || playerHand.length === 0}
            className={`bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-opacity ${
              gameOver || playerHand.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Stand
          </button>
        </div>

        {/* Start */}
        <div className="buttonStart-container mb-6">
          <button
            onClick={() => startGame(setMessage)}
            disabled={gameActive}
            className={`bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors ${
              gameActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Start Game
          </button>
        </div>

        {/* Bet amount */}
        <div className="flex items-center gap-4">
          <select
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="w-full p-2 bg-gray-900 text-white rounded-lg shadow-md"
          >
            {[10, 20, 50, 100, 200, 500, 1000].map((amount) => (
              <option key={amount} value={amount} disabled={amount > credits}>
                {amount} Credits
              </option>
            ))}
          </select>
          <img src={`/chips/${bet}.png`} alt={`${bet} chip`} className="w-10 h-10" />
        </div>

        {/* Message popup */}
        {message && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div
              className={`backdrop-blur-md p-6 rounded-xl text-4xl font-bold shadow-xl text-center transition-opacity duration-300 ${
                fade ? "opacity-100" : "opacity-0"
              } ${
                message.toLowerCase().includes("win")
                  ? "text-green-500"
                  : message.toLowerCase().includes("lose")
                  ? "text-red-500"
                  : "text-yellow-400"
              }`}
            >
              {message}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blackjack;
