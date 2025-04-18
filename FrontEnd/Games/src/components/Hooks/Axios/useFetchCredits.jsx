import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchCredits = () => {
  const [credits, setCredits] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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


  return { credits, error, loading , fetchCredits };
};

export default useFetchCredits;