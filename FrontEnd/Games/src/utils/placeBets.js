import axios from "axios";

export const placeBet = async ({ bet, setBetId, playCoin, updateCredits }) => {
  const token = localStorage.getItem("token");
  if (bet <= 0) return { success: false, message: "Invalid bet amount" };

  try {
    const response = await axios.post(
      `http://localhost:1010/auth/place`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { amount: bet },
      }
    );

    const match = response.data.match(/Bet ID: (\d+)/);
    const id = match ? parseInt(match[1]) : null;
    if (id) setBetId(id);

    await updateCredits();
    if (playCoin) playCoin();

    return { success: true };
  } catch (error) {
    console.error("Place bet error:", error);
    return { success: false, message: "Bet failed" };
  }

};


