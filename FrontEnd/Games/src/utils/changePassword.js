import axios from "axios";

export const changePassword = async ({ oldPassword, newPassword }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { success: false, message: "You must be logged in." };
  }

  try {
    const response = await axios.put(
      "http://localhost:1010/auth/update-password",
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: "Failed to change password." };
    }
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, message: "Old password is incorrect." };
    }
    return { success: false, message: "An error occurred. Please try again." };
  }
};
