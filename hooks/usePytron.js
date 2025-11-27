import { useState, useEffect } from 'react';
import pytron from 'pytron-client';

const usePytron = () => {
  const [api, setApi] = useState(pytron);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      // If pywebview is present assume backend available
      if (window.pywebview?.api) {
        setIsReady(true);
      }
    };

    checkReady();
    window.addEventListener('pywebviewready', checkReady);
    return () => window.removeEventListener('pywebviewready', checkReady);
  }, []);

  return { api, isReady };
};

export default usePytron;
