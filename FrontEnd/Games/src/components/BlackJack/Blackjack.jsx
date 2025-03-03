import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import './Blackjack.css';
import Card from '../Card/Card';
import blackjackImage from '../assests/blackjack.jpg';
import { Link } from 'react-router-dom';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
    if (['J', 'Q', 'K'].includes(card.rank)) return 10;
    if (card.rank === 'A') return 11; 
    return parseInt(card.rank);
};

const Blackjack = () => {
    const [deck, setDeck] = useState(createDeck());
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const [fade, setFade] = useState(false);

    const isBlackjack = (hand) => {
        return (hand[0].rank === 'A' && hand[1].rank === 'J') || 
                (hand[0].rank === 'A' && hand[1].rank === 'K') || 
                (hand[0].rank === 'A' && hand[1].rank === 'Q') || 
                (hand[0].rank === 'A' && hand[1].rank === '10') || 
                (hand[0].rank === 'J' && hand[1].rank === 'A') || 
                (hand[0].rank === 'K' && hand[1].rank === 'A') || 
                (hand[0].rank === 'Q' && hand[1].rank === 'A') || 
                (hand[0].rank === '10' && hand[1].rank === 'A')
    };

    const calculateScore = (hand, forceAceAsEleven = false) => {
        let score = hand.reduce((total, card) => total + getCardValue(card), 0);
        let aces = hand.filter(card => card.rank === 'A').length;
    
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
            setFade(true);
            const timer = setTimeout(() => {
                setFade(false)
            }, 10000); 

            return () => clearTimeout(timer);
        }
    }, [message]);
    
    const startGame = () => {
        const newDeck = createDeck();
        setDeck(newDeck);
        const playerCards = [newDeck.pop(), newDeck.pop()];
        const dealerCards = [newDeck.pop(), newDeck.pop()];
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
        setDeck(newDeck);
        setGameOver(false);

        if (isBlackjack(playerCards) && !(calculateScore(dealerCards) >= calculateScore(playerCards))) {
            setMessage('You got a Blackjack! You win!');
            setGameOver(true);
        } else if (isBlackjack(dealerCards) && !(calculateScore(playerCards) >= calculateScore(dealerCards))) {
            setMessage('Dealer got a Blackjack! You lose!');
            setGameOver(true);
        } else if(isBlackjack(playerCards) && calculateScore(dealerCards) === calculateScore(playerCards) || isBlackjack(dealerCards) && calculateScore(playerCards) === calculateScore(dealerCards)){
            setMessage('It\'s a tie!');
            setGameOver(false)
        }   else{
            setGameOver(false)
            setFade(false)
            setMessage('')
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
            } else if (dealerScore > 21) {
                setMessage('You win! (Dealer busted)');
            } else if (playerScore > dealerScore) {
                setMessage('You win!');
            } else if (playerScore < dealerScore) {
                setMessage('You lose!');
            } else if (playerScore === 21 && dealerScore < 21) {
                setMessage('You win')
            } else {
                setMessage('It\'s a tie!');
            }
            
            setGameOver(true);
            setDeck(newDeck);
        }
    };

    return (
        <>
            <Typography variant="h4" align="center" color="white" className="dynamic-background">
                Blackjack
            </Typography>
            <Box className="container">
                <Box className="dealer-box">
                    <Typography variant="h6" color="black">Dealer's Hand:</Typography>
                    <Box display="flex" justifyContent="center" flexWrap="wrap">
                        {dealerHand.map((card, index) => (
                            <Card key={index}>
                                {card.rank} of {card.suit}
                            </Card>
                        ))}
                    </Box>
                    <Typography variant="h6" color="black">Dealer's Score: {calculateScore(dealerHand)}</Typography>
                </Box>

                <Box className="button-container">
                    <Button variant="contained" color="primary" onClick={startGame}>
                        Start Game
                    </Button>
                </Box>

                <Box className="player-box">
                    <Typography variant="h6" color="black">Your Hand:</Typography>
                    <Box display="flex" justifyContent="center" flexWrap="wrap">
                        {playerHand.map((card, index) => (
                            <Card key={index}>
                                {card.rank} of {card.suit}
                            </Card>
                        ))}
                    </Box>
                    <Typography variant="h6" color="black">Your Score: {calculateScore(playerHand)}</Typography>
                </Box>

                <Box className="button-container">
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={hit} 
                        disabled={gameOver || playerHand.length === 0} 
                        sx={{ 
                            marginRight: '10px', 
                            opacity: gameOver || playerHand.length === 0 ? 0.5 : 1, 
                            cursor: gameOver || playerHand.length === 0 ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        Hit
                    </Button>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={stand} 
                        disabled={gameOver || playerHand.length === 0} 
                        sx={{ 
                            opacity: gameOver || playerHand.length === 0 ? 0.5 : 1, 
                            cursor: gameOver || playerHand.length === 0 ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        Stand
                    </Button>
                </Box>

                {message && (
                    <Box className={`message ${fade ? 'fade-in' : 'fade-out'} ${message.includes('lose') ? 'bust' : message.includes('win') ? 'win' : message.includes('tie') ? 'tie' : ''}`}>
                        <Typography variant="h6" align="center">
                            {message}
                        </Typography>
                    </Box>
                )}

                <Box className="button-container">
                    <Link to="http://localhost:3000">
                        <Button variant="contained" color="secondary">Close Blackjack</Button>
                    </Link>
                </Box>
            </Box>
        </>
    );
};

export default Blackjack;