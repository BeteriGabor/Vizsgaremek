import React from "react";
import "./App.css"
import Sign_in from "./components/Sign_in/Sign_in";
import { Button, Box } from '@mui/material'
import { Link } from 'react-router-dom';

function App() {

const style = {
  width: '400px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 48,
  borderRadius: '8px', 
  p: 4,
  outline: 'none'
};

const style2 = {
  display: 'flex',
  justifyContent: 'center'
}

  return (
    <>
      <Box sx={style}>
            <Box sx={style2}>
              <Link to="/blackjack">
                <Button variant="contained" type="submit" color="secondary" >Blackjack</Button>
              </Link>
              <Link>
                <Button variant="contained" type="submit" color="secondary" >Slot</Button>
              </Link>
            </Box>
          </Box>
    </>
  );
}

export default App;
