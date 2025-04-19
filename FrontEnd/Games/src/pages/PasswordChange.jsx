import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function PasswordChange() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to change your password.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:1010/auth/update-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("✅Password changed successfully!");
        navigate("/sign_in");
      } else {
        alert("❌Failed to change password. Please try again.");
      }
    }
    catch (error) {
      if (error.response && error.response.status === 401) {
        alert("❌Old password is incorrect.");
      } else {
        alert("❌An error occurred. Please try again.");
      }
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>Old Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                  >
                   {showPassword ? <img src="/emoji/looking.png" alt="👁️" className="w-10"/>:<img src="/emoji/eyesclosed.png" alt="🙈" className="w-10"/> }
                  </button>
                </div>
              </div>

              <div>
                <label>New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                  >
                    {showPassword ? <img src="/emoji/looking.png" alt="👁️" className="w-10"/>:<img src="/emoji/eyesclosed.png" alt="🙈" className="w-10"/> }
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Change Password
                </button>
                <Link to="/sign_in">
                  <button
                    type="button"
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PasswordChange;
