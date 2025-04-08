import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(1000); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
  
    const fetchCredits = async () => {
      try {
        const response = await axios.get('http://localhost:1010/auth/wallet/balance');
        setCredits(response.data.balance); 
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []); 

  const exit = () => {
    navigate('/');
  };

  const pathName = window.location.pathname.split('/').pop();
  const pageName = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center bg-gray-800 text-white p-4 z-10">
        <button
          onClick={exit}
          className="absolute left-4 bg-red-500 text-white py-2 px-4 rounded-lg text-lg"
        >
          Exit
        </button>
        <img className="h-10 absolute left-1/3" src="logo.png" alt="" />
        <div className="flex-1 text-center text-xl font-bold">
          {pageName}
        </div>

        <div className="absolute right-4 text-lg">
          {loading ? 'Loading...' : error ? `Error: ${error}` : `Credits: ${credits}`}
        </div>
        {typeof children === 'function' 
          ? children({ credits, setCredits }) 
          : React.cloneElement(children || <div/>, { credits, setCredits })}
      </div>
    </>
  );
};

export default Navbar;
