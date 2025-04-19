import axios from "axios";

export const resolveBet = async ({ betId, win, multiplier = 1, playWin, playLose, updateCredits }) => {
  if (!betId) return;

  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `http://localhost:1010/api/resolve/${betId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { win, multiplier },
      }
    );

    await updateCredits();
    if (win && playWin) playWin();
    if (!win && playLose) playLose();
  } catch (err) {
    console.error("Resolve bet error", err);
  }
};
