import { useState, useEffect } from 'react';
import pytron from 'pytron-client';

const usePytron = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await pytron.waitForBackend(2000);
        if (mounted) setIsReady(true);
      } catch (e) {
        console.warn("Pytron backend not detected immediately.", e);
        if (mounted) setIsReady(false);
      }
    };
    init();

    return () => { mounted = false; };
  }, []);

  return { api: pytron, isReady };
};

export default usePytron;
