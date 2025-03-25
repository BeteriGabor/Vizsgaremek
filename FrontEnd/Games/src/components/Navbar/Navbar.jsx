import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(1000);

  const exit = () => {
    navigate('/');
  };

  const pathName = window.location.pathname.split('/').pop();
  const pageName = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center bg-gray-800 text-white p-4 z-10">
      <button
        onClick={exit}
        className="absolute left-4 bg-red-500 text-white py-2 px-4 rounded-lg text-lg"
      >
        Exit
      </button>

      <div className="flex-1 text-center text-xl font-bold">
        {pageName}
      </div>

      <div className="absolute right-4 text-lg">
        Credits: {credits}
      </div>

      {children && React.cloneElement(children, { credits, setCredits })}
    </div>
  );
};

export default Navbar;
