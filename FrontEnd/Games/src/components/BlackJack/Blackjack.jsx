import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "1",
];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const getCardValue = (card) => {
  if (["11", "12", "13"].includes(card.rank)) return 10;
  if (card.rank === "1") return 11;
  return parseInt(card.rank);
};

const Blackjack = () => {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [bet, setBet] = useState(10);
  const [fade, setFade] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [betId, setBetId] = useState(null);
  const navbarRef = useRef();

  useEffect(() => {
    if (message) {
      setFade(true);
      const timer = setTimeout(() => {
        setFade(false);
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const isBlackjack = (hand) => {
    return (
      (hand[0].rank === "1" &&
        ["10", "11", "12", "13"].includes(hand[1].rank)) ||
      (["10", "11", "12", "13"].includes(hand[0].rank) && hand[1].rank === "1")
    );
  };

  const calculateScore = (hand, forceAceAsEleven = false) => {
    let score = hand.reduce((total, card) => total + getCardValue(card), 0);
    let aces = hand.filter((card) => card.rank === "1").length;
    if (forceAceAsEleven && score <= 21) {
      score += aces;
    } else {
      while (score > 21 && aces) {
        score -= 10;
        aces--;
      }
    }
    return score;
  };

  const placeBet = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:1010/auth/place`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            amount: bet,
          },
        }
      );
      navbarRef.current?.refreshCredits();
      const match = response.data.match(/Bet ID: (\d+)/);
      const id = match ? parseInt(match[1]) : null;
      if (id) setBetId(id);
    } catch (err) {
      setMessage("Failed to place bet");
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
      if (navbarRef.current?.refreshCredits) navbarRef.current.refreshCredits();
    } catch (err) {
      console.error("Resolve bet error", err);
    }
  };

  const startGame = async () => {
    if (gameActive) {
      setMessage("A game is already in progress!");
      return;
    }
    await placeBet();
    const newDeck = createDeck();
    setDeck(newDeck);
    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setDeck(newDeck);
    setGameOver(false);
    setGameActive(true);
    if (isBlackjack(playerCards)) {
        setMessage('You got a Blackjack! You win!');
        Navbar.credits=(prevCredits => prevCredits + bet * 1.5); 
        setGameOver(true);
        setGameActive(false)
    } else if (isBlackjack(dealerCards)) {
        setMessage('Dealer got a Blackjack! You lose!');
        Navbar.credits=(prevCredits => prevCredits - bet);
        setGameOver(true);
        setGameActive(false)
    }
  };

  const hit = () => {
    if (!gameOver && playerHand.length > 0) {
      const newDeck = [...deck];
      const newCard = newDeck.pop();
      const newHand = [...playerHand, newCard];
      setPlayerHand(newHand);
      setDeck(newDeck);
      const playerScore = calculateScore(newHand);
      if (playerScore > 21) {
        setMessage("You busted! You lose!");
        resolveBet(false);
        setGameOver(true);
        setGameActive(false);
      }
    }
  };

  const stand = () => {
    if (!gameOver && playerHand.length > 0) {
      let newDeck = [...deck];
      let dealerCards = [...dealerHand];
      const playerScore = calculateScore(playerHand);
      let dealerScore = calculateScore(dealerCards);
      while (dealerScore < 17) {
        const newCard = newDeck.pop();
        dealerCards.push(newCard);
        dealerScore = calculateScore(dealerCards);
      }
      setDealerHand(dealerCards);
      setDeck(newDeck);
      let win = false;
      if (dealerScore > 21 || playerScore > dealerScore) {
        setMessage("You win!");
        win = true;
      } else if (playerScore < dealerScore) {
        setMessage("You lose!");
      } else {
        setMessage("It's a tie!");
      }
      resolveBet(win, 2);
      setGameOver(true);
      setGameActive(false);
    }
  };

  const getCardImage = (rank, suit) => {
    return require(`../assets/cards/${suit} ${rank}.png`);
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-blackjackbg bg-cover">
        <div className="flex flex-wrap justify-center space-x-4 mb-4 w-full max-w-5xl px-4">
          <div className="dealer-box p-4 border-2 border-gray-700 bg-green-950 rounded-xl shadow-lg w-full md:w-1/2 lg:w-1/3">
            <h2 className="text-xl text-center text-white">Dealer's Hand:</h2>
            <div className="flex justify-center flex-wrap gap-2">
              {dealerHand.map((card, index) =>
                gameOver ? (
                  <img
                    key={index}
                    src={getCardImage(card.rank, card.suit)}
                    alt={`${card.suit} ${card.rank}`}
                    className="w-20 h-32"
                  />
                ) : index === 0 ? (
                  <img
                    key={index}
                    src={getCardImage(card.rank, card.suit)}
                    alt={`${card.suit} ${card.rank}`}
                    className="w-20 h-32"
                  />
                ) : (
                  <img
                    key={index}
                    src={require("../assets/cards/Card Back 3.png")}
                    alt="Card Back"
                    className="w-20 h-32"
                  />
                )
              )}
            </div>
            <p className="text-xl text-center text-white">
              Dealer's Score:{" "}
              {gameOver
                ? calculateScore(dealerHand)
                : dealerHand.length > 0
                ? getCardValue(dealerHand[0])
                : 0}
            </p>
          </div>

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

        <div className="button-container flex justify-center space-x-4 mb-6 w-full max-w-3xl px-4">
          <button
            onClick={hit}
            disabled={gameOver || playerHand.length === 0}
            className={`bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-opacity ${
              gameOver || playerHand.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
          >
            Hit
          </button>
          <button
            onClick={stand}
            disabled={gameOver || playerHand.length === 0}
            className={`bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-opacity ${
              gameOver || playerHand.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
          >
            Stand
          </button>
        </div>

        <div className="buttonStart-container mb-6">
          <button
            onClick={startGame}
            className={`bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors 
                            ${
                              gameActive ? "opacity-50 cursor-not-allowed" : ""
                            }`}
            disabled={gameActive}
          >
            Start Game
          </button>
        </div>

        <div className="header flex justify-between items-center mb-6 p-4 rounded-xl shadow-lg w-full max-w-3xl px-4">
          <div className="form-control w-full">
            <label htmlFor="bet-amount" className="block text-white mb-2">
              Bet Amount
            </label>
            <select
              id="bet-amount"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-full p-2 bg-white text-black rounded-lg shadow-md"
            >
              {[10, 20, 50, 100].map((amount) => (
                <option key={amount} value={amount}>
                  {amount} Credits
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-6">
          {message && (
            <div
              className={`message-container p-4 rounded-xl text-white shadow-lg ${
                fade ? "fade-in" : "fade-out"
              } 
                        ${
                          message.includes("lose")
                            ? "bg-red-600 border-l-4 border-red-800"
                            : message.includes("win")
                            ? "bg-green-600 border-l-4 border-green-800"
                            : message.includes("tie")
                            ? "bg-gray-600 border-l-4 border-gray-800"
                            : "bg-yellow-500 border-l-4 border-yellow-700"
                        }`}
              style={{ transition: "all 0.5s ease" }}
            >
              <h2 className="text-center text-xl font-semibold">{message}</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blackjack;
