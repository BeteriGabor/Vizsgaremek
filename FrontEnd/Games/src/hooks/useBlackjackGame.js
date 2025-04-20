import { useState, useEffect } from "react";

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "1"];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

export const getCardValue = (card) => {
  if (!card) return 0;
  if (["11", "12", "13"].includes(card.rank)) return 10;
  if (card.rank === "1") return 11;
  return parseInt(card.rank);
};

export const useBlackjackGame = ({
  playCoin,
  playWin,
  playLose,
  updateCredits,
  navbarRef,
  placeBet,
  resolveBet,
}) => {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [bet, setBet] = useState(10);
  const [betId, setBetId] = useState(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    updateCredits(navbarRef, setCredits);
  }, []);

  const isBlackjack = (hand) => {
    return (
      (hand[0].rank === "1" && ["10", "11", "12", "13"].includes(hand[1].rank)) ||
      (["10", "11", "12", "13"].includes(hand[0].rank) && hand[1].rank === "1")
    );
  };

  const calculateScore = (hand) => {
    let score = hand.reduce((total, card) => total + getCardValue(card), 0);
    let aces = hand.filter((card) => card.rank === "1").length;

    while (score > 21 && aces) {
      score -= 10;
      aces--;
    }

    return score;
  };

  const getCardImage = (rank, suit) => {
    return require(`../components/assets/cards/${suit} ${rank}.png`);
  };

  const startGame = async (setMessage) => {
    if (gameActive) {
      setMessage("A game is already in progress!");
      return;
    }

    const result = await placeBet({
      bet,
      setBetId,
      playCoin,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });

    if (!result.success) {
      setMessage("Failed to place bet");
      return;
    }

    const newDeck = createDeck();
    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameOver(false);
    setGameActive(true);

    const newBetId = result.betId;

    if (isBlackjack(playerCards)) {
      setMessage("You got a Blackjack! You win!");
      resolveBet({
        betId: newBetId,
        win: true,
        multiplier: 2,
        playWin,
        playLose,
        updateCredits: () => updateCredits(navbarRef, setCredits),
      });
      setGameOver(true);
      setGameActive(false);
    } else if (isBlackjack(dealerCards)) {
      setMessage("Dealer got a Blackjack! You lose!");
      resolveBet({
        betId: newBetId,
        win: false,
        multiplier: 1,
        playWin,
        playLose,
        updateCredits: () => updateCredits(navbarRef, setCredits),
      });
      setGameOver(true);
      setGameActive(false);
    }
  };

  const hit = (setMessage) => {
    if (gameOver || playerHand.length === 0) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];

    setPlayerHand(newHand);
    setDeck(newDeck);

    const playerScore = calculateScore(newHand);
    if (playerScore > 21) {
      setMessage("You busted! You lose!");
      resolveBet({
        betId,
        win: false,
        multiplier: 1,
        playWin,
        playLose,
        updateCredits: () => updateCredits(navbarRef, setCredits),
      });
      setGameOver(true);
      setGameActive(false);
    }
  };

  const stand = (setMessage) => {
    if (gameOver || playerHand.length === 0) return;
  
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
    let multiplier = 1;
  
    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage("You win!");
      win = true;
      multiplier = 2;
    } else if (playerScore < dealerScore) {
      setMessage("You lose!");
      win = false;
      multiplier = 1;
    } else {
      // TIE
      setMessage("It's a tie!");
      win = true;       // treat as refund
      multiplier = 1;   // return original bet
    }
  
    resolveBet({
      betId,
      win,
      multiplier,
      playWin,
      playLose,
      updateCredits: () => updateCredits(navbarRef, setCredits),
    });
  
    setGameOver(true);
    setGameActive(false);
  };
  

  return {
    deck,
    playerHand,
    dealerHand,
    gameOver,
    gameActive,
    bet,
    betId,
    credits,
    setDeck,
    setPlayerHand,
    setDealerHand,
    setGameOver,
    setGameActive,
    setBet,
    setBetId,
    setCredits,
    startGame,
    hit,
    stand,
    calculateScore,
    getCardImage,
    getCardValue,
  };
};