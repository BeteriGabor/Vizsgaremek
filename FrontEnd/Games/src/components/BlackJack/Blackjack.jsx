import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import './Blackjack.css';
import blackjackImage from '../assets/blackjack.jpg';
import { Link } from 'react-router-dom';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

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
    if (['Jack', 'Queen', 'King'].includes(card.rank)) return 10;
    if (card.rank === 'Ace') return 11; 
    return parseInt(card.rank);
};

const Blackjack = () => {
    const [deck, setDeck] = useState(createDeck());
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const [credits, setCredits] = useState(100); // Kezdő kreditek
    const [bet, setBet] = useState(0); // Fogadott összeg
    const [gameStarted, setGameStarted] = useState(false); // Nyomon követjük, hogy a játék elindult-e

    const isBlackjack = (hand) => {
        return (hand[0].rank === 'Ace' && hand[1].rank === 'Jack') || 
                (hand[0].rank === 'Ace' && hand[1].rank === 'King') || 
                (hand[0].rank === 'Ace' && hand[1].rank === 'Queen') || 
                (hand[0].rank === 'Ace' && hand[1].rank === '10') || 
                (hand[0].rank === 'Jack' && hand[1].rank === 'Ace') || 
                (hand[0].rank === 'King' && hand[1].rank === 'Ace') || 
                (hand[0].rank === 'Queen' && hand[1].rank === 'Ace') || 
                (hand[0].rank === '10' && hand[1].rank === 'Ace');
    };

    const calculateScore = (hand, forceAceAsEleven = false) => {
        let score = hand.reduce((total, card) => total + getCardValue(card), 0);
        let aces = hand.filter(card => card.rank === 'Ace').length;
    
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

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000); // 5 másodperc múlva eltűnik az üzenet
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    const startGame = () => {
        if (bet <= 0 || bet > credits) {
            setMessage("Please place a valid bet.");
            return;
        }

        const newDeck = createDeck();
        setDeck(newDeck);
        const playerCards = [newDeck.pop(), newDeck.pop()];
        const dealerCards = [newDeck.pop(), newDeck.pop()];
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
        setDeck(newDeck);
        setGameStarted(true); // Beállítjuk, hogy elindult a játék
        setGameOver(false);

        if (isBlackjack(playerCards)) {
            setMessage('You got a Blackjack! You win!');
            setCredits(prevCredits => prevCredits + bet * 1.5); // Blackjack esetén 1.5x a nyeremény
            setGameOver(true);
        } else if (isBlackjack(dealerCards)) {
            setMessage('Dealer got a Blackjack! You lose!');
            setCredits(prevCredits => prevCredits - bet);
            setGameOver(true);
        }
    };

    const hit = () => {
        if (!gameOver && playerHand.length > 0) {
            const newDeck = [...deck];
            const newCard = newDeck.pop();
            setPlayerHand([...playerHand, newCard]);
            setDeck(newDeck);
            if (calculateScore([...playerHand, newCard]) > 21) {
                setMessage('Bust! You lose.');
                setCredits(prevCredits => prevCredits - bet);
                setGameOver(true);
            } else if (calculateScore([...playerHand, newCard]) === 21) {
                stand();
            }
        }
    };

    const stand = () => {
        if (!gameOver && playerHand.length > 0) {
            let newDeck = [...deck];
            let dealerScore = calculateScore(dealerHand);

            while (dealerScore < 17) {
                const newCard = newDeck.pop();
                setDealerHand([...dealerHand, newCard]);
                dealerScore = calculateScore([...dealerHand, newCard]);
                newDeck = newDeck;
            }

            const playerScore = calculateScore(playerHand);

            if (playerScore > 21) {
                setMessage('You lose! (Busted)');
                setCredits(prevCredits => prevCredits - bet);
            } else if (dealerScore > 21) {
                setMessage('You win! (Dealer busted)');
                setCredits(prevCredits => prevCredits + bet);
            } else if (playerScore > dealerScore) {
                setMessage('You win!');
                setCredits(prevCredits => prevCredits + bet);
            } else if (playerScore < dealerScore) {
                setMessage('You lose!');
                setCredits(prevCredits => prevCredits - bet);
            } else {
                setMessage('It\'s a tie!');
            }

            setGameOver(true);
            setGameStarted(false); // Visszaállítjuk a gameStarted állapotot
            setDeck(newDeck);
        }
    };

    const handleExit = () => {
        window.location.href = '/'; 
    };
     const getCardImage = (rank, suit) => {
                return require(`../assets/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.png`);
            };
    return (
        <>
            <Typography variant="h4" className="dynamic-background">
                Blackjack
            </Typography>
            <Box className="container">
                <Box className="dealer-box">
                    <Typography variant="h6">Dealer's Hand:</Typography>
                    <Box className="card-container">
                        {dealerHand.map((card, index) => (
                            <img key={index} src={getCardImage(card.rank, card.suit)} alt={`${card.rank} of ${card.suit}`} />
                        ))}
                    </Box>
                    <Typography variant="h6">Dealer's Score: {calculateScore(dealerHand)}</Typography>
                </Box>

                <Box className="player-box">
                    <Typography variant="h6" color="black">Your Hand:</Typography>
                    <Box className="card-container">
                        {playerHand.map((card, index) => (
                            <img key={index} src={getCardImage(card.rank, card.suit)} alt={`${card.rank} of ${card.suit}`} />
                        ))}
                    </Box>
                    <Typography variant="h6" color="black">Your Score: {calculateScore(playerHand)}</Typography>
                </Box>

                <Typography className={`credit-display ${credits < 20 ? 'low-credits' : ''}`}>
                    Credits: {credits}
                </Typography>

                <Box className="bet-box">
                    <FormControl fullWidth>
                        <InputLabel>Bet Amount</InputLabel>
                        <Select
                            value={bet}
                            label="Bet Amount"
                            onChange={(e) => setBet(e.target.value)}
                        >
                            {[10, 20, 50, 100].map((amount) => (
                                <MenuItem key={amount} value={amount}>
                                    {amount} Credits
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box className="button-container">
                    <Button
                        variant="contained"
                        onClick={startGame}
                        disabled={gameStarted} 
                    >
                        Start Game
                    </Button>
                </Box>

                <Box className="button-container">
                    <Button variant="contained" color="secondary" onClick={hit} disabled={gameOver || playerHand.length === 0}>Hit</Button>
                    <Button variant="contained" color="secondary" onClick={stand} disabled={gameOver || playerHand.length === 0}>Stand</Button>
                </Box>

                {message && (
                    <Box className={`message ${message.includes('lose') ? 'bust' : message.includes('win') ? 'win' : message.includes('tie') ? 'tie' : ''}`}>
                        <Typography variant="h6" align="center">{message}</Typography>
                    </Box>
                )}

                <button className="exit-button" onClick={handleExit}>EXIT</button>
            </Box>
        </>
    );
};

export default Blackjack;
