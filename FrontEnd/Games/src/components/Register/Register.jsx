import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

function Register() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHelp, setPasswordHelp] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [emailError, setEmailError] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (password !== passwordHelp) {
      alert("Passwords do not match!");
      return;
    }

    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:1010/auth/register', {
        username,
        email,
        password,
        role: 'user',
        birthDate
      });

      const userID = response.data.ourUsers.id;

      const formData = new FormData();
      formData.append('userId', userID);
      formData.append('file', file);

      try {
        await axios.post(`http://localhost:1010/api/images/upload`, formData);
      } catch (error) {
        alert('⚠️ Error uploading image.');
      }

      alert("Registration successful!");
      navigate('/sign_in');
    } catch (error) {
      alert("Registration failed! Please try again.");
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-defbg px-4">
          <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Create Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm mb-1 block">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full p-3 pr-10 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <img src="/emoji/looking.png" alt="👁️" className="w-10"/>:<img src="/emoji/eyesclosed.png" alt="🙈" className="w-10"/> }
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm mb-1 block">Repeat Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordHelp}
                  onChange={(e) => setPasswordHelp(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repeat your password"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Birthdate</label>
                <input
                  type="date"
                  required
                  max={dayjs().subtract(18, 'year').format("YYYY-MM-DD")}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your@email.com"
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label className="text-sm mb-1 block">Upload your profile image</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-white"
                />
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-semibold px-6 py-3 rounded-lg w-full"
                >
                  Create Account
                </button>
                <Link
                  to="/sign_in"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg w-full text-center"
                >
                  Back to Login
                </Link>
              </div>

              <p className="text-xs text-center mt-4 text-gray-400">
                ⚠️ Gambling can be addictive. Play responsibly.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
