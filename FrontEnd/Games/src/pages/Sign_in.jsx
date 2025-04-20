import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleLogin } from "../utils/loginHandler";

function Sign_in() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await handleLogin({ username, password });
    if (result.success) {
      alert(result.message || "Login successful!");
      window.close();
    } else {
      alert(result.message || "❌ Login failed! Please check your credentials.");
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-defbg px-4">
          <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Sign In</h2>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="text-sm mb-1 block">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pr-10 rounded-lg bg-gray-700 text-white border border-gray-600"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <img src="/emoji/looking.png" alt="👁️" className="w-10" />
                    ) : (
                      <img src="/emoji/eyesclosed.png" alt="🙈" className="w-10" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
                >
                  Login
                </button>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                <span>No account yet?</span>
                <Link to="/register" className="text-green-400 hover:underline">
                  Register!
                </Link>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Forgot password?</span>
                <Link to="/password_change" className="text-red-400 hover:underline">
                  Change it!
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sign_in;
