import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import './Blackjack.module.css';
import { useNavigate } from 'react-router-dom';


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
    const [credits, setCredits] = useState(100); 
    const [bet, setBet] = useState(0); 
    const navigate = useNavigate();
    const [fade, setFade] = useState(false);

    useEffect(() => {
        if (message) {
            setFade(true); 
            const timer = setTimeout(() => {
                setFade(false); 
                setMessage(''); 
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [message]);


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
            setFade(true);
            const timer = setTimeout(() => {
                setFade(false);
                const clearMessageTimer = setTimeout(() => {
                    setMessage(''); 
                }, 500);
                return () => clearTimeout(clearMessageTimer);
            }, 10000);
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
        setGameOver(false);

        if (isBlackjack(playerCards)) {
            setMessage('You got a Blackjack! You win!');
            setCredits(prevCredits => prevCredits + bet * 1.5); 
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
                stand();
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
            if(dealerScore === playerScore) {
                setMessage('It\'s a tie!');
            } else if(playerScore ===21){
                if(dealerScore === 21){
                    setMessage('It\'s a tie!');
                } else {
                    setMessage('You win!');
                    setCredits(prevCredits => prevCredits + bet);
                }
            } else if (playerScore > 21) {
                if(dealerScore > 21){
                    setMessage('It\'s a tie!');
                    setCredits(prevCredits => prevCredits + bet);
                }else{
                    setMessage('You lose!');
                    setCredits(prevCredits => prevCredits - bet);
                }
            }
                

            setGameOver(true);
            setDeck(newDeck);
        }
    };

    function exit() {
        navigate('/');
    }

    const getCardImage = (rank, suit) => {
        return require(`../assets/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.png`);
    };
    
    return(
        <>
            <Box className="game-container">
                <Box className="header">
                    <Button variant='contained' onClick={exit} color='error' className='exit'>Exit</Button>
                    <Typography variant="h4" align="center" color="black">
                        Blackjack
                    </Typography>
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
                    <Typography className={`credit-display ${credits < 20 ? 'low-credits' : ''}`}>
                        Credits: {credits}
                    </Typography>
                </Box>

                <Box className="container">
                    <Box className="dealer-box">
                        <Typography variant="h6" color="black" textAlign={"center"}>Dealer's Hand:</Typography>
                        <Box display="flex" justifyContent="center" flexWrap="wrap">
                        {dealerHand.map((card, index) => (
                            index === 0 ? (
                                <img key={index} src={getCardImage(card.rank, card.suit)} alt={`${card.rank} of ${card.suit}`} />
                            ) : (
                                <img key={index} src={require('../assets/cards/back_of_card.png')} alt="Card Back" />
                            )
                            ))}
                        </Box>
                        <Typography variant="h6" color="black" textAlign={"center"}>Dealer's Score: {dealerHand.length > 0 ? getCardValue(dealerHand[0]) : 0}</Typography>
                    </Box>

                    <Box className="player-box">
                        <Typography variant="h6" color="black" textAlign={"center"}>Your Hand:</Typography>
                        <Box display="flex" justifyContent="center" flexWrap="wrap">
                            {playerHand.map((card, index) => (
                                <img key={index} src={getCardImage(card.rank, card.suit)} alt={`${card.rank} of ${card.suit}`} />
                            ))}
                        </Box>
                        <Typography variant="h6" color="black" textAlign={"center"}>Your Score: {calculateScore(playerHand)}</Typography>
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


                    <Box className="buttonStart-container">
                        <Button variant="contained" color="primary" onClick={startGame}>
                            Start Game
                        </Button>
                    </Box>
                
                    <Box className="message">
                        {message && (
                            <Box className={`message ${fade ? 'fade-in' : 'fade-out'} ${message.includes('lose') ? 'bust' : message.includes('win') ? 'win' : message.includes('tie') ? 'tie' : ''}`}>
                                <Typography variant="h6" align="center">
                                    {message}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </>   
    );
};

export default Blackjack;
