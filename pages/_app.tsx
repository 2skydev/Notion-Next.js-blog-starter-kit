// global styles shared across the entire site
import 'styles/global.css';

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/styles.css';

// used for rendering equations (optional)
import 'katex/dist/katex.min.css';

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css';

// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'

// global style overrides for notion
import 'styles/notion.css';

// global style overrides for prism theme (optional)
import 'styles/prism-theme.css';

import 'styles/custom/index.scss';

import * as React from 'react';

import type { AppProps } from 'next/app';

import { RecoilRoot, useRecoilState } from 'recoil';
import { preferencesStore } from 'stores/settings';
import { useEffect } from 'react';

const Bootstrap = () => {
  const [preferences, setPreferences] = useRecoilState(preferencesStore);

  // 기기의 다크모드 연동
  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setPreferences({ ...preferences, isDarkMode: event.matches });
    });
  }, []);

  return null;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Bootstrap />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
