import { isServer } from 'lib/config';
import { atom, AtomEffect } from 'recoil';

interface PreferencesStoreValues {
  isDarkMode: boolean;
}

const isCurrentUserDarkMode = isServer
  ? false
  : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialValues: PreferencesStoreValues = {
  isDarkMode: isCurrentUserDarkMode,
};

const localStorageSyncEffect: AtomEffect<PreferencesStoreValues> = ({ onSet }) => {
  onSet(newValue => {
    localStorage.setItem('preferences', JSON.stringify(newValue));
  });
};

export const preferencesStore = atom<PreferencesStoreValues>({
  key: 'preferences',
  default:
    isServer || !localStorage.getItem('preferences')
      ? initialValues
      : JSON.parse(localStorage.getItem('preferences')),
  effects: [localStorageSyncEffect],
});
