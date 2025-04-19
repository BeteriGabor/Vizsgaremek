import axios from 'axios';

export const handleRegister = async ({
  username,
  email,
  password,
  passwordHelp,
  birthDate,
  file,
  setEmailError
}) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (password !== passwordHelp) {
    return { success: false, message: "Passwords do not match!" };
  }

  if (!emailPattern.test(email)) {
    setEmailError("Invalid email format!");
    return { success: false };
  }

  try {
    const res = await axios.post('http://localhost:1010/auth/register', {
      username,
      email,
      password,
      role: 'user',
      birthDate
    });

    const userID = res.data.ourUsers.id;

    if (file) {
      const formData = new FormData();
      formData.append('userId', userID);
      formData.append('file', file);
      await axios.post('http://localhost:1010/api/images/upload', formData);
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Something went wrong" };
  }
};
