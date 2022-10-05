import * as React from 'react';
import { useEffect } from 'react';

import { Router, useRouter } from 'next/router';

import cs from 'classnames';

const PageLoading = () => {
  const { isFallback } = useRouter();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };

    const end = () => {
      setLoading(false);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <div className={cs('PageLoading', (isFallback || loading) && 'visible')}>
      <div className="icon"></div>
    </div>
  );
};

export default PageLoading;
