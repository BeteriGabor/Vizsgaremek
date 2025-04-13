import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Wallet = () => {
  const [hover, setHover] = useState("");
  const navigate = useNavigate();
  const navbarRef = useRef();

  const handleNavigateToDeposit = () => {
    navigate("/deposit");
    if (navbarRef.current?.refreshCredits) navbarRef.current.refreshCredits();
  };

  const handleNavigateToWithdraw = () => {
    navigate("/withdraw");
    if (navbarRef.current?.refreshCredits) navbarRef.current.refreshCredits();
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
      console.error("Failed to fetch transactions:", error);
      alert("Could not download transactions.");
    }
  };

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden bg-bank bg-center">
  
  <Navbar ref={navbarRef} />
  <div className="relative z-20 flex justify-center items-center h-full px-4">
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Welcome to Your Wallet</h2>

      <button
        onClick={handleNavigateToDeposit}
        className="w-full py-3 px-4 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-red-600 transition duration-200"
      >
        💰 Deposit
      </button>

      <button
        onClick={handleNavigateToWithdraw}
        className="w-full py-3 px-4 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-green-600 transition duration-200"
      >
        🏧 Withdraw
      </button>

      <button
        onClick={handleDownloadTransactions}
        className="w-full py-3 px-4 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-blue-600 transition duration-200"
      >
        📄 Download Transactions
      </button>
    </div>
  </div>
</div>

    </>
  );
};

export default Wallet;
