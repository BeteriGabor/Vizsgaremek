import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = forwardRef(({ children }, ref) => {
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
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center bg-gray-800 text-white z-10 shadow-md">
      <div className="absolute -left-3 top-0 py-4 px-4  bg-slate-800 rounded-3xl ">
      <button
        onClick={exit}
        className=" bg-red-500 hover:bg-red-600 text-white hover:py-2 hover:px-4 rounded-lg text-base hover:text-lg "
      >
        Exit
      </button>
      </div>
      <div className="absolute left-32 top-0 flex flex-row gap-4">
        <div className=" hover:py-4 hover:px-4  hover:bg-slate-800 rounded-3xl ">
          <img src="chicken.png" alt=""  className="h-7 w-7"/>
        </div>
        <div className="hover:py-4 hover:px-4  hover:bg-slate-800 rounded-3xl ">
          <img src="airplane.png" alt=""  className="h-auto w-7"/>
        </div>
        <div className="hover:py-4 hover:px-4  hover:bg-slate-800 rounded-3xl">
          <img src="casinoicon.png" alt="" className="w-7 h-7"/>
        </div>
        <div className="hover:py-4 hover:px-4  hover:bg-slate-800 rounded-3xl">
          <img src="roulette.png" className="w-7 h-7" alt="" />
        </div>
        <div className="hover:py-4 hover:px-4  hover:bg-slate-800 rounded-3xl">
          <img src="bj.png" className="w-auto h-7" alt="" />
        </div>
      </div>
      <img className="h-10 absolute left-1/3" src="logo.png" alt="Logo" />

      <div className="flex-1 text-center text-xl font-bold">{pageName}</div>

      <div className="absolute right-4 text-lg">
        {loading
          ? "Loading..."
          : error
          ? `Error: ${error}`
          : `Balance: ${credits}`}
      </div>
    </div>
  );
});

export default Navbar;
