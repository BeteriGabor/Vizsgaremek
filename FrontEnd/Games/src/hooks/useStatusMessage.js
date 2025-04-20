import { useState, useEffect } from "react";

export const useStatusMessage = () => {
  const [message, setMessage] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (message) {
      setFade(true);
      const timer = setTimeout(() => {
        setFade(false);
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return { message, fade, setMessage };
};
