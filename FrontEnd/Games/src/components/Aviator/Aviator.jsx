import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import './Aviator.module.css';


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
            <Box sx={{ textAlign: 'center', padding: 2 }}>
                <Typography variant="h4" gutterBottom>Aviator</Typography>
                <Box className="flight-display" sx={{ margin: 2, position: 'relative', height: '200px', border: '2px solid #007BFF', borderRadius: '8px' }}>
                    <div className="airplane" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}></div>
                    <Typography variant="h6" className="multiplier-display" sx={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)' }}>
                        Szorzó: <span>{multiplier}x</span>
                    </Typography>
                </Box>
                <Box className="controls" sx={{ margin: 2 }}>
                    <Button variant="contained" color="primary" onClick={placeBet}>Tét elhelyezése</Button>
                    <Button variant="contained" color="secondary" onClick={cashOut}>Kivétel</Button>
                </Box>
                <Typography variant="body1" className="status">{statusMessage}</Typography>
                <Link to="http://localhost:3000">
                    <Button variant="outlined" color="error">Close Aviator</Button>
                </Link>
            </Box>
        </>
    );
};

export default Aviator;