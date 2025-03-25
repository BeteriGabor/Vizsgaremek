import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from "@mui/material"
import './Aviator.module.css';
import Navbar from '../Navbar/Navbar';


const Aviator = () => {
    const [multiplier, setMultiplier] = useState(1.00);
    const [isFlying, setIsFlying] = useState(false);
    const [statusMessage, setStatusMessage] = useState("There is no active game!");

    useEffect(() => {
        let flightInterval;
        if (isFlying) {
            setStatusMessage("Game started!");
            flightInterval = setInterval(() => {
                setMultiplier(prev => {
                    const newMultiplier = parseFloat((prev + 0.01).toFixed(2));
                    return newMultiplier;
                });
            }, 100);

            const randomFlightDuration = Math.floor(Math.random() * (120000 - 1000 + 1)) + 1000;
            console.log(randomFlightDuration)

            setTimeout(() => {
                clearInterval(flightInterval);
                setIsFlying(false);
                setStatusMessage("The plane crashed!");
            }, randomFlightDuration);  
        }
        return () => clearInterval(flightInterval);
    }, [isFlying]);

    const placeBet = () => {
        if (!isFlying) {
            setIsFlying(true);
        }
    };

    const cashOut = () => {
        if (isFlying) {
            setIsFlying(false);
            setStatusMessage(`Cash out: ${multiplier}x!`);
            setMultiplier(1.00)
        } else {
            setStatusMessage("There is no active game!");
        }
    };

    return (
        <>
            <Navbar />
            <Box sx={{ textAlign: 'center', padding: 2 }}>
                <Typography variant="h4" gutterBottom>Aviator Game</Typography>
                <Box 
                    className="flight-display" 
                    sx={{ 
                        margin: 2, 
                        position: 'relative', 
                        height: '300px', 
                        border: '3px solid #007BFF', 
                        borderRadius: '12px', 
                        background: 'linear-gradient(to top, #87CEEB, #FFFFFF)' 
                    }}
                >
                    <div 
                        className="airplane" 
                        style={{ 
                            position: 'absolute', 
                            bottom: isFlying ? `${multiplier * 10}px` : '0', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            transition: 'bottom 0.1s linear' 
                        }}
                    >
                        ✈️
                    </div>
                    <Typography 
                        variant="h6" 
                        className="multiplier-display" 
                        sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            fontWeight: 'bold', 
                            color: '#333' 
                        }}
                    >
                        Multiplier: <span>{multiplier}x</span>
                    </Typography>
                </Box>
                <Box className="controls" sx={{ margin: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={placeBet} 
                        disabled={isFlying}
                        sx={{ marginRight: 1 }}
                    >
                        Place Bet
                    </Button>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={cashOut} 
                        disabled={!isFlying}
                        sx={{ marginLeft: 1 }}
                    >
                        Cash Out
                    </Button>
                </Box>
                <Typography 
                    variant="body1" 
                    className="status" 
                    sx={{ marginTop: 2, fontStyle: 'italic', color: '#555' }}
                >
                    {statusMessage}
                </Typography>
            </Box>
        </>
    );
};

export default Aviator;