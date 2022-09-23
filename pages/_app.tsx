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
import '~/components/Comments/comments.scss';

import * as React from 'react';

import type { AppProps } from 'next/app';

import { RecoilRoot, useRecoilState } from 'recoil';
import { preferencesStore } from 'stores/settings';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { posthogConfig, posthogId } from '~/lib/config';
import { useRouter } from 'next/router';
import { SWRConfig, SWRConfiguration } from 'swr';
import axios from 'axios';
import { bootstrap } from '~/lib/bootstrap-client';

const Bootstrap = () => {
  const [preferences, setPreferences] = useRecoilState(preferencesStore);

  const router = useRouter();

  // posthog
  useEffect(() => {
    function onRouteChangeComplete() {
      if (posthogId) {
        posthog.capture('$pageview');
      }
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig);
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router.events]);

  useEffect(() => {
    if (preferences.isDarkMode) {
      if (!document.body.classList.contains('dark-mode')) {
        document.body.classList.add('dark-mode');
      }
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [preferences.isDarkMode]);

  useEffect(() => {
    bootstrap();

    // 기기의 다크모드 연동
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setPreferences({ ...preferences, isDarkMode: event.matches });
    });
  }, []);

  return null;
};

const swrConfig: SWRConfiguration = {
  errorRetryCount: 3,
  errorRetryInterval: 500,
  revalidateOnFocus: false,
  revalidateIfStale: false,
  fetcher: (url: string) => axios.get(url).then(res => res.data),
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SWRConfig value={swrConfig}>
        <Bootstrap />
        <Component {...pageProps} />
      </SWRConfig>
    </RecoilRoot>
  );
}
