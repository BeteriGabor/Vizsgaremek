import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function PasswordChange() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHelp, setPasswordHelp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  const fetchUser = async (name) => {
    try {
      const response = await axios.get(`http://localhost:1010/admin/get-all-users`);
      const users = response.data.data;
      const user = users.find(user => user.name === name);
      return user ? user.id : null;
    } catch (error) {
      alert("User not found!");
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== passwordHelp) {
      alert("Passwords are not the same!");
      return;
    }

    const userId = await fetchUser(username);
    if (userId) {
      try {
        await axios.put(`http://localhost:1010/admin/update/${userId}`, {
          password: password,
        });
        alert("Password successfully changed! Login with the new password.");
        navigate('/sign_in');
      } catch (error) {
        alert("There was an error changing password!");
        console.error(error);
      }
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label>New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordHelp}
                    onChange={(e) => setPasswordHelp(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                  >
                    {showPassword ? '🙈' : '👁️'}
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
