import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Bank = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState("");


  const handleNavigateToDeposit = () => navigate('/deposit');
  const handleNavigateToWithdraw = () => navigate('/withdraw');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-bank bg-center">

      <video
        autoPlay
        muted
        loop
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          hover === "deposit" ? "opacity-100" : "opacity-0"
        }`}
        src="/chipsfalling.mp4"
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          hover === "withdraw" ? "opacity-100" : "opacity-0"
        }`}
        
        src="/moneyfalling.mp4"
      />


      <div className="relative z-10 flex gap-4 justify-center items-center h-full   px-4">
        <button
          onClick={handleNavigateToDeposit}
          onMouseEnter={() => setHover("deposit")}
          onMouseLeave={() => setHover("")}
          className="flex-1 py-4 max-w-sm px-6 text-xl font-semibold text-white bg-gray-800 rounded-lg hover:bg-red-800 transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus:outline-none"
        >
          Deposit
        </button>

        <button
          onClick={handleNavigateToWithdraw}
          onMouseEnter={() => setHover("withdraw")}
          onMouseLeave={() => setHover("")}
          className="flex-1 py-4 max-w-sm px-6 text-xl font-semibold text-white bg-gray-800 rounded-lg hover:bg-green-800 transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus:outline-none"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}
export default Bank