import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Bank = () => {
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

        <video
          autoPlay
          muted
          loop
          playsInline
          className={`absolute top-0 left-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${
            hover === "deposit" ? "opacity-100" : "opacity-0"
          }`}
          src="/chipsfalling.mp4"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`absolute top-0 left-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${
            hover === "withdraw" ? "opacity-100" : "opacity-0"
          }`}
          src="/moneyfalling.mp4"
        />

        <div className="relative z-20 flex flex-col sm:flex-row gap-4 justify-center items-center h-full pt-24 sm:pt-0 px-4">
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

          <button
            onClick={handleDownloadTransactions}
            className="flex-1 py-4 max-w-sm px-6 text-xl font-semibold text-white bg-gray-800 rounded-lg hover:bg-blue-800 transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus:outline-none"
          >
            Download Transactions
          </button>
        </div>
      </div>
    </>
  );
};

export default Bank;
