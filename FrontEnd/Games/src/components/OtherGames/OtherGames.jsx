import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OtherGames = () => {
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState('bg-og');
  
  const handleNavigateToAviator = () => navigate('/aviator');
  const handleNavigateToChicken = () => navigate('/chicken');





  
  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-screen w-screen p-5 transition-all duration-500 bg-cover bg-center ${bgImage}`}
    >
    
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-2xl">
        <button
          onClick={handleNavigateToChicken}
          onMouseEnter={() => setBgImage('bg-chickencover')}
          onMouseLeave={() => setBgImage('bg-og')}
          className="flex-1 py-4 px-6 text-xl font-semibold text-white bg-gray-800 rounded-lg hover:bg-red-800 transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus:outline-none"
        >
          Chicken Game
        </button>

        <button
          onClick={handleNavigateToAviator}
          onMouseEnter={() => setBgImage('bg-aviatorcover')}
          onMouseLeave={() => setBgImage('bg-og')}
          className="flex-1 py-4 px-6 text-xl font-semibold text-white  bg-gray-800  rounded-lg hover:bg-red-800  transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus:outline-none"
        >
          Aviator
        </button>
      </div>
    </div>
  )
}
export default OtherGames