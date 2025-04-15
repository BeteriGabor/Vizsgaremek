import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Wallet = () => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const navbarRef = useRef();

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:1010/auth/wallet/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCredits(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const handleNavigateToDeposit = () => {
    navigate("/deposit");
    navbarRef.current?.refreshCredits?.();
    fetchCredits();
  };

  const handleNavigateToWithdraw = () => {
    navigate("/withdraw");
    navbarRef.current?.refreshCredits?.();
    fetchCredits();
  };

  const handleDownloadTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:1010/transactions/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transactions = response.data;

      const doc = new jsPDF();
      doc.text("Transaction History", 14, 16);

      autoTable(doc, {
        head: [["ID", "Amount", "Type", "Date"]],
        body: transactions.map((tx) => [
          tx.id,
          tx.amount,
          tx.transactionType,
          new Date(tx.timestamp).toLocaleString(),
        ]),
        startY: 20,
      });

      doc.save("transactions.pdf");
    } catch (error) {
      console.error("❌Failed to fetch transactions:", error);
      alert("❌Could not download transactions.");
    }
  };
  const chipValues = [1000, 500, 200, 100, 50, 20, 10];

    const calculateChips = (totalCredits) => {
      const result = [];
      let remaining = totalCredits;
    
      for (let value of chipValues) {
        const count = Math.floor(remaining / value);
        if (count > 0) {
          result.push({ value, count });
          remaining -= count * value;
        }
      }
    
      return result;
    };

    const chipBreakdown = calculateChips(credits);


  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden bg-bank bg-center">
        <Navbar ref={navbarRef} />
        <div className="relative z-20 flex justify-center items-center h-full px-4 gap-4">
          <div className="hidden md:block  bg-gray-900/95 text-white p-6 rounded-xl shadow-xl w-full max-w-4xl space-y-4"> 
              <h2 className="text-2xl font-bold text-center">Credit Breakdown</h2>
              <p className="text-center text-lg">Total credits: {credits}</p>
              <div className="flex flex-col md:flex-row justify-between gap-8 mt-4">            
                <div className="w-full md:w-3/4">
                  <table className="w-full text-center border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-gray-300">
                        <th>Chip</th>
                        <th>Quantity</th>
                        <th>Icon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chipBreakdown.map((chip) => (
                        <tr key={chip.value}>
                          <td>{chip.value} credits</td>
                          <td>{chip.count} pcs</td>
                          <td>
                            <img
                              src={`/chips/${chip.value}.png`}
                              alt={`${chip.value}`}
                              className="w-10 mx-auto"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
                    
                <div className=" w-full md:w-1/4 flex gap-6 justify-center items-end ">
                  {chipBreakdown.map((chip) => (
                    <div key={chip.value} className="flex flex-col items-center mb-10">
                      {[...Array(chip.count)].map((_, idx) => (
                        <img
                          key={idx}
                          src={`/chips/${chip.value}.png`}
                          alt={`${chip.value}`}
                          className="hidden lg:block w-10 -mb-[50px] drop-shadow-md  "
                        />
                      ))}

                    </div>
                  ))}
                </div>
              </div>
            </div>     
          <div className="bg-gray-900/95 text-white  p-8 rounded-xl shadow-xl w-full max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">Welcome to Your Wallet</h2>
            

            <button
              onClick={handleNavigateToDeposit}
              className="w-full py-3 px-4 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-red-600 transition duration-200  "
            >
              <img src="/emoji/bag.png" alt="💰" className="w-8 h-8 mx-auto" /> Deposit
            </button>

            <button
              onClick={handleNavigateToWithdraw}
              className="w-full py-3 px-4 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-green-600 transition duration-200"
            >
              <img src="/emoji/banknote.png" alt="💵" className="w-8 h-8 mx-auto" /> Withdraw
            </button>

            <button
              onClick={handleDownloadTransactions}
              className="w-full py-3 px-4 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-blue-600 transition duration-200"
            >
              <img src="/emoji/downloading.png" alt="⬇️" className="w-8 h-8 mx-auto" />Download Transactions
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
