import React, { useState, useEffect } from 'react';
import "./App.css"
import { Button, Box } from '@mui/material'
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function App() {
  const [isLandscape, setIsLandscape] = useState(true);

  const checkOrientation = () => {
    setIsLandscape(window.innerWidth > window.innerHeight);
  };

  useEffect(() => {
    checkOrientation();

    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  if (!isLandscape) {
    return (
      <div>
        <h1>Az oldal csak fekvő helyzetben elérhető!</h1>
      </div>
    );
  }

  return (
    <>
      <iframe src="http://localhost:3000?token=5" frameborder="0" style={{width:'100vw' , height:'100vh'}}></iframe>
    </>
  );
}

export default App;
