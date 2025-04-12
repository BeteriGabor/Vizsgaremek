import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = forwardRef((_, ref) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:1010/auth/wallet/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCredits(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshCredits: fetchCredits,
  }));

  const exit = () => {
    window.close();
  };

  const pathName = window.location.pathname.split("/").pop();
  const pageName = pathName
    ? pathName.charAt(0).toUpperCase() + pathName.slice(1)
    : "HomePage";

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-lg border-b border-gray-700 px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-y-2">
      
      {/* Exit + icons (only on desktop) */}
      <div className="flex items-center justify-start w-full sm:w-auto gap-3">
        <button
          onClick={exit}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs sm:text-sm"
        >
          Exit
        </button>

        <div className="hidden sm:flex gap-2">
          <img src="chicken.png" alt="Chicken" title="Chicken Run" onClick={() => navigate("/chicken")} className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition cursor-pointer" />
          <img src="airplane.png" alt="Airplane" title="Jet Crash" onClick={() => navigate("/aviator")} className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition cursor-pointer" />
          <img src="casinoicon.png" alt="Casino" title="Slot Machine" onClick={() => navigate("/slot")} className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition cursor-pointer" />
          <img src="roulette.png" alt="Roulette" title="Roulette" onClick={() => navigate("/roulette")} className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition cursor-pointer" />
          <img src="bj.png" alt="Blackjack" title="Blackjack" onClick={() => navigate("/blackjack")} className="h-6 sm:h-7 hover:scale-110 transition cursor-pointer" />
        </div>
      </div>

      {/* Logo + page name (desktop only) */}
      <div className="hidden sm:flex items-center justify-center gap-2 mx-auto">
        <img src="logo.png" alt="Logo" className="h-6 sm:h-8" />
        <div className="text-yellow-300 font-bold text-base sm:text-lg tracking-wide">
          {pageName}
        </div>
      </div>

      {/* Balance */}
      <div className="flex justify-end w-full sm:w-auto">
        <div className="text-sm sm:text-base font-medium text-right sm:text-left">
          {loading ? (
            <span className="animate-pulse text-gray-400">Loading...</span>
          ) : error ? (
            <span className="text-red-400">Error: {error}</span>
          ) : (
            <span className="text-yellow-400">
              Balance: {credits}
              <span className="hidden sm:inline"> 🪙</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default Navbar;
