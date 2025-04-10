import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:1010/auth/wallet/balance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCredits(response.data); // csak simán a data, ha szám jön vissza
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const exit = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const pathName = window.location.pathname.split('/').pop();
  const pageName = pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1) : 'Kezdőlap';

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center bg-gray-800 text-white p-4 z-10 shadow-md">
      <button
        onClick={exit}
        className="absolute left-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-lg"
      >
        Kilépés
      </button>

      <img className="h-10 absolute left-1/3" src="logo.png" alt="Logo" />

      <div className="flex-1 text-center text-xl font-bold">
        {pageName}
      </div>

      <div className="absolute right-4 text-lg">
        {loading ? 'Betöltés...' : error ? `Hiba: ${error}` : `Egyenleg: ${credits} Ft`}
      </div>

      {typeof children === 'function'
        ? children({ credits, setCredits })
        : React.cloneElement(children || <div />, { credits, setCredits })}
    </div>
  );
};

export default Navbar;
