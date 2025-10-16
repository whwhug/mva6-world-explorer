import { useState, useEffect } from "react";

export const useMapboxToken = () => {
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hardcoded token for immediate access
    setToken("");
    setIsLoading(false);
  }, []);

  return { token, isLoading };
};
