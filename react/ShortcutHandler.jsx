import { useEffect } from 'react';
import pytron from 'pytron-client';

const ShortcutHandler = ({ disableBrowserDefaults = true }) => {
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
      // 0. Prevent browser defaults if enabled
      if (disableBrowserDefaults) {
        // Block F5, Ctrl+R, Cmd+R
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r')) {
          e.preventDefault();
        }
      }

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

      // Check if this combo is registered
      if (registeredShortcuts.length > 0 && !registeredShortcuts.includes(combo)) {
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

    fetchShortcuts();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disableBrowserDefaults]);

  return null; // Invisible component
};

export default ShortcutHandler;
