import React from "react";
import "./App.css"
import { Button, Box } from '@mui/material'
import Typography from '@mui/material/Typography';
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
  justifyContent: 'space-between'
}

  return (
    <>
      <Typography variant="h5" gutterBottom align="center" color="white" className="dynamic-background2">
        Welcome in our Casino!  
      </Typography>
      <Box sx={style}>
            <Box sx={style2}>
          <Link to="/blackjack">
            <Button variant="contained" type="submit" color="secondary" >Blackjack</Button>
          </Link>
          <Link to="/slot">
            <Button variant="contained" type="submit" color="secondary" >Slot</Button>
          </Link>
          <Link to="/sign_in">
            <Button variant="contained" type="submit" color="secondary">Login</Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}

export default App;
