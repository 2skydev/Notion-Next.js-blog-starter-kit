import { useRecoilState } from 'recoil';
import { preferencesStore } from 'stores/settings';

export function useDarkMode() {
  const [preferences, setPreferences] = useRecoilState(preferencesStore);

  return {
    isDarkMode: preferences.isDarkMode,
    toggleDarkMode: () =>
      setPreferences({
        ...preferences,
        isDarkMode: !preferences.isDarkMode,
      }),
  };
}
