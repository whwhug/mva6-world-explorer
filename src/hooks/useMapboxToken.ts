import { useState, useEffect } from "react";

export const useMapboxToken = () => {
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hardcoded token for immediate access
    setToken("pk.eyJ1IjoiaHVnb2RhIiwiYSI6ImNtNzhhOG9rZzFmNTUya3F5a296anJ6M2sifQ.qgYb-0FMOKHVGlDABeK7bA");
    setIsLoading(false);
  }, []);

  return { token, isLoading };
};
