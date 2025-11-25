import { useState, useEffect } from 'react';

const usePytron = () => {
  const [api, setApi] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkApi = () => {
      if (window.pywebview?.api) {
        setApi(window.pywebview.api);
        setIsReady(true);
      }
    };

    if (window.pywebview?.api) {
      checkApi();
    } else {
      window.addEventListener('pywebviewready', checkApi);
    }

    return () => window.removeEventListener('pywebviewready', checkApi);
  }, []);

  return { api, isReady };
};

export default usePytron;
