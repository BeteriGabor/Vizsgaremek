import axios from "axios";

export const handleLogin = async ({ username, password }) => {
  try {
    const res = await axios.post("http://localhost:1010/auth/login", {
      username,
      password,
    });

    const { token, message } = res.data;
    if (token) {
      localStorage.clear();
      localStorage.setItem("token", token);
      return { success: true, message };
    }

    return { success: false, message: "No token received." };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed.",
    };
  }
};
