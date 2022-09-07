import { useEffect, useState } from 'react';

const isSSR = typeof window === 'undefined';

const isCurrentUserDarkMode = isSSR
  ? false
  : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export function useDarkMode() {
  const storageValue = isSSR ? false : localStorage.getItem('darkMode');

  const [isDarkMode, setIsDarkMode] = useState(
    storageValue ? storageValue === 'true' : isCurrentUserDarkMode ? true : false,
  );

  useEffect(() => {
    const darkModeChangeListener = event => {
      setIsDarkMode(event.matches);
    };

    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', darkModeChangeListener);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', darkModeChangeListener);
    };
  }, [isDarkMode]);

  return {
    isDarkMode: isDarkMode,
    toggleDarkMode: () => setIsDarkMode(!isDarkMode),
  };
}
