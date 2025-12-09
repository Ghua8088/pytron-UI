import { useEffect } from 'react';
import pytron from 'pytron-client';

const ShortcutHandler = () => {
  useEffect(() => {
    let registeredShortcuts = [];

    const fetchShortcuts = async () => {
      try {
        if (pytron?.get_registered_shortcuts) {
          registeredShortcuts = await pytron.get_registered_shortcuts();
        }
      } catch (e) {
        // Silently fail if backend not ready or method missing
      }
    };

    const handleKeyDown = async (e) => {
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
      if (pytron?.trigger_shortcut) {
        try {
          const handled = await pytron.trigger_shortcut(combo);
          if (handled) {
            e.preventDefault();
          }
        } catch (err) { }
      }
    };

    // Initial fetch - pytron proxy will wait if needed (or we could use pytron.waitForBackend())
    fetchShortcuts();

    // Also listen for re-connection or ready event if needed, but for now fetch once constitutes "mounted" behavior.

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // Invisible component
};

export default ShortcutHandler;
