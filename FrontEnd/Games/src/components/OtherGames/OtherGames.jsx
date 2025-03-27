import React from 'react';
import { useNavigate } from 'react-router-dom';

const OtherGames = () => {
  const navigate = useNavigate();
  
  const handleNavigateToAviator = () => {
    navigate('/aviator');
  };
  
  const handleNavigateToChicken = () => {
    navigate('/chicken');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-defbg p-5">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center drop-shadow-lg" style={{ textShadow: "2px 2px 2px rgba(255, 255, 255, 0.9)" }}>Other Games</h1>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-2xl">
        <button
          onClick={handleNavigateToAviator}
          className="flex-1 py-4 px-6 text-xl font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus:outline-none"
        >
          Aviator
        </button>
        
        <button
          onClick={handleNavigateToChicken}
          className="flex-1 py-4 px-6 text-xl font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus:outline-none"
        >
          Chicken Game
        </button>
      </div>
    </div>
  );
};

export default OtherGames;