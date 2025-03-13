import React from 'react';
import { Paper } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Paper)(({ theme }) => ({
    padding: '10px',
    margin: '5px',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    border: '20,px solid #ccc',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
    display:'flex',
    flexDirection:'row',
}));

const Card = ({ children }) => {
    return <StyledCard>{children}</StyledCard>;
};


export default Card;