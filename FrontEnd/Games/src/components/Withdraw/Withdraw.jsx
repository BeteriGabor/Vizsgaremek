import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Withdraw() {
  const [open, setOpen] = useState(false);
  const [amounta, setAmounta] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleSelectChange = (e) => {
    const value = parseInt(e.target.value);
    setAmounta(value);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmounta(value);
    } else {
      setAmounta(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amounta <= 0) {
      setError("Please select or enter a valid withdrawal amount.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('amount', amounta);

      const response = await axios.post(`http://localhost:1010/auth/wallet/withdraw`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        alert("✅ Withdrawal was successful!");
        navigate('/wallet');
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong during withdrawal.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-blackjackbg">
        <div className=" w-sceen h-screen bg-withdrawbg">
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
              <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Withdraw Funds</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="withdrawamount" className="block mb-1 font-medium">
                      Select amount:
                    </label>
                    <select
                      name="WithdrawAmount"
                      id="withdrawamount"
                      className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                      onChange={handleSelectChange}
                      value={amounta && !customAmount ? amounta : ''}
                    >
                      <option value="">Choose an amount...</option>
                      <option value="1000">1000 Ft</option>
                      <option value="2500">2500 Ft</option>
                      <option value="5000">5000 Ft</option>
                    </select>
              </div>

                  <div>
                    <label htmlFor="withdrawCustom" className="block mb-1 font-medium">
                      Or enter custom amount:
                    </label>
                    <input
                      type="text"
                      name="withdrawCustom"
                      id="withdrawCustom"
                      value={customAmount}
                      onChange={handleCustomChange}
                      placeholder="e.g., 1234"
                      className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${
                        loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                      } text-white px-4 py-2 rounded`}
                    >
                      {loading ? 'Processing...' : 'Withdraw'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        navigate('/wallet');
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

          )}
        </div>
      </div>
    </>
  );
}

export default Withdraw;
