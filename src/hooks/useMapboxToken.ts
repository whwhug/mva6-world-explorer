import { useState, useEffect } from 'react';

export const useMapboxToken = () => {
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [needsToken, setNeedsToken] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken && storedToken !== 'pk.your_mapbox_public_token_here') {
      setToken(storedToken);
      setNeedsToken(false);
    } else {
      setNeedsToken(true);
    }
    setIsLoading(false);
  }, []);

  const setMapboxToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('mapbox_token', newToken);
    setNeedsToken(false);
  };

  return { token, isLoading, needsToken, setMapboxToken };
};