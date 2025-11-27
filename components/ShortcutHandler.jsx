import { useEffect } from 'react';
import pytron from 'pytron-client';

const ShortcutHandler = () => {
  useEffect(() => {
    let registeredShortcuts = [];

    const fetchShortcuts = async () => {
      if (pytron?.get_registered_shortcuts) {
        registeredShortcuts = await pytron.get_registered_shortcuts();
      }
    };

    const handleKeyDown = async (e) => {
      if (!pytron?.trigger_shortcut) return;

      // Build key combo string
      const parts = [];
      if (e.ctrlKey) parts.push('Ctrl');
      if (e.metaKey) parts.push('Cmd'); // Mac
      if (e.altKey) parts.push('Alt');
      if (e.shiftKey) parts.push('Shift');
      
      // Key normalization
      let key = e.key.toUpperCase();
      if (key === 'CONTROL' || key === 'ALT' || key === 'SHIFT' || key === 'META') return;
      
      parts.push(key);
      const combo = parts.join('+');

      // Check if this combo is registered (optional optimization, but good to avoid spamming Python)
      // We can also just send everything, but let's check if we have the list.
      if (registeredShortcuts.length > 0 && !registeredShortcuts.includes(combo)) {
          // Try alternative for Mac (Cmd vs Ctrl) if needed, but for now strict match
          return;
      }

      // Trigger Python
      const handled = await pytron.trigger_shortcut(combo);
      if (handled) {
        e.preventDefault();
      }
    };

    // Initial fetch
    if (window.pywebview) {
        fetchShortcuts();
    } else {
        window.addEventListener('pywebviewready', fetchShortcuts);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pywebviewready', fetchShortcuts);
    };
  }, []);

  return null; // Invisible component
};

export default ShortcutHandler;
