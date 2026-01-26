import React, { createContext, useContext, useEffect, useState } from 'react';

// Default Dark Theme (VS Code-like)
const defaultTheme = {
  bg: '#1e1e1e',           // Main Window Background
  fg: '#cccccc',           // Main Text Color
  primary: '#0078d4',      // Primary Action Color (Grid, Buttons)
  primaryFg: '#ffffff',    // Text on Primary
  secondary: '#333333',    // Secondary Background (Hover states, etc)
  surface: '#252526',      // Panels, Menus, Dialogs
  border: '#333333',       // Borders
  danger: '#e81123',       // Destructive actions
  success: '#107c10',      // Success states
  warning: '#d83b01',      // Warning states
};

const ThemeContext = createContext(defaultTheme);

export const ThemeProvider = React.memo(({ theme = {}, children }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  useEffect(() => {
    // Merge user theme with defaults
    const finalTheme = { ...defaultTheme, ...theme };
    setCurrentTheme(finalTheme);

    // Apply CSS variables to :root so they are available globally
    const root = document.documentElement;

    // Helper to convert camelCase to kebab-case for CSS vars
    // e.g. primaryFg -> --pytron-primary-fg
    const toKebab = (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

    Object.entries(finalTheme).forEach(([key, value]) => {
      root.style.setProperty(`--pytron-${toKebab(key)}`, value);
    });
  }, [theme]);

  // Inject a global style block for some base defaults that use these vars
  // This ensures that even if components use inline styles, they have access to the vars via class names 
  // or if they default to these vars.
  return (
    <ThemeContext.Provider value={currentTheme}>
      <style>{`
          body {
            background-color: var(--pytron-bg);
            color: var(--pytron-fg);
          }
          /* Scrollbar theming for Webkit */
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            background-color: var(--pytron-bg);
          }
          ::-webkit-scrollbar-thumb {
            background-color: var(--pytron-secondary);
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: var(--pytron-primary);
          }
          ::-webkit-scrollbar-corner {
              background-color: var(--pytron-bg);
          }
        `}</style>
      {children}
    </ThemeContext.Provider>
  );
});

export const useTheme = () => useContext(ThemeContext);
