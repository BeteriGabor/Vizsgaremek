import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';


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
    const [bet, setBet] = useState(0); 
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
        if (bet <= 0 || bet > Navbar.credits) {
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
            Navbar.credits=(prevCredits => prevCredits + bet * 1.5); 
            setGameOver(true);
        } else if (isBlackjack(dealerCards)) {
            setMessage('Dealer got a Blackjack! You lose!');
            Navbar.credits=(prevCredits => prevCredits - bet);
            setGameOver(true);
        }
    };

    const hit = () => {
        if (!gameOver && playerHand.length > 0) {
            const newDeck = [...deck];
            const newCard = newDeck.pop();
            setPlayerHand([...playerHand, newCard]);
            setDeck(newDeck);
            if (calculateScore([...playerHand, newCard]) >= 21) {
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
                    setGameOver(true);
                } else {
                    setMessage('You win!');
                    setGameOver(true);
                    Navbar.credits=(prevCredits => prevCredits + bet);
                }
            } else if (playerScore > 21) {
                if(dealerScore > 21){
                    setMessage('It\'s a tie!');
                    setGameOver(true);
                    Navbar.credits=(prevCredits => prevCredits + bet);
                }else{
                    setMessage('You lose!');
                    setGameOver(true);
                    Navbar.credits=(prevCredits => prevCredits - bet);
                }
            }
            setGameOver(true);
            setDeck(newDeck);
        }
    };

    

    const getCardImage = (rank, suit) => {
        return require(`../assets/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.png`);
    };
    
    return(
        <> 
            <Navbar></Navbar> 
            <div className="container flex flex-col items-center justify-center min-h-screen w-full">
                <div className="flex justify-center space-x-4 mb-4 w-full max-w-5xl">
                    <div className="dealer-box p-4 border-2 border-gray-700 rounded-xl shadow-lg w-full max-w-3xl">
                        <h2 className="text-xl text-center text-white">Dealer's Hand:</h2>
                        <div className="flex justify-center flex-wrap">
                            {dealerHand.map((card, index) => (
                                gameOver || index === 0 ? (
                                    <img key={index} src={getCardImage(card.rank, card.suit)} alt={`${card.rank} of ${card.suit}`} className="w-20 h-32 mr-2" />
                                ) : (
                                    <img key={index} src={require('../assets/cards/back_of_card.png')} alt="Card Back" className="w-20 h-32 mr-2" />
                                )
                            ))}
                        </div>
                        <p className="text-xl text-center text-white">
                            Dealer's Score: {gameOver ? calculateScore(dealerHand) : (dealerHand.length > 0 ? getCardValue(dealerHand[0]) : 0)}
                        </p>
                    </div>

                    <div className="player-box p-4 border-2 border-gray-700 rounded-xl shadow-lg w-full max-w-3xl">
                        <h2 className="text-xl text-center text-white">Your Hand:</h2>
                        <div className="flex justify-center flex-wrap">
                            {playerHand.map((card, index) => (
                                <img key={index} src={getCardImage(card.rank, card.suit)} alt={`${card.rank} of ${card.suit}`} className="w-20 h-32 mr-2" />
                            ))}
                        </div>
                        <p className="text-xl text-center text-white">Your Score: {calculateScore(playerHand)}</p>
                    </div>
                </div>

                <div className="button-container flex justify-center space-x-4 mb-6">
                    <button 
                        onClick={() => hit(Navbar.credits, Navbar.setCredits)} 
                        disabled={gameOver || playerHand.length === 0} 
                        className={`bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-opacity ${gameOver || playerHand.length === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}>
                        Hit
                    </button>
                    <button 
                        onClick={() => stand(Navbar.credits, Navbar.setCredits)} 
                        disabled={gameOver || playerHand.length === 0} 
                        className={`bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-opacity ${gameOver || playerHand.length === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}>
                        Stand
                    </button>
                </div>

                <div className="buttonStart-container mb-6">
                    <button 
                        onClick={() => startGame(Navbar.credits, Navbar.setCredits)} 
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Start Game
                    </button>
                </div>

                <div className="header flex justify-between items-center mb-6 p-4 rounded-xl shadow-lg w-full max-w-3xl">
                    <div className="form-control w-full">
                        <label htmlFor="bet-amount" className="block text-white mb-2">Bet Amount</label>
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

                <div className="message mt-6 w-full p-6 rounded-xl shadow-lg">
                    {message && (
                        <div className={`message ${fade ? 'fade-in' : 'fade-out'} ${message.includes('lose') ? 'bg-red-600' : message.includes('win') ? 'bg-green-700' : message.includes('tie') ? 'bg-gray-600' : ''}`}>
                            <h2 className="text-center text-white">{message}</h2>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Blackjack;
