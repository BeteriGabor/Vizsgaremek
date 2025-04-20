import axios from "axios";

export const resolveBet = async ({ betId, win, multiplier = 1, playWin, playLose, updateCredits }) => {
  if (!betId) {
    console.error("No betId provided!");
    return;
  }

  const token = localStorage.getItem("token");
  const winBoolean = !!win;
  const multiplierNumber = Number(multiplier);

  console.log("Sending resolveBet with:", { betId, winBoolean, multiplierNumber });

  try {
    await axios.post(
      `http://localhost:1010/api/resolve/${betId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          win: winBoolean,
          multiplier: multiplierNumber,
        },
      }
    );

    if (updateCredits) await updateCredits();
    if (winBoolean && playWin) playWin();
    if (!winBoolean && playLose) playLose();
  } catch (err) {
    console.error("Resolve bet error", err);
  }
};
