import * as React from 'react';
import { Router } from 'next/router';
import { useEffect } from 'react';
import cs from 'classnames';

const PageLoading = () => {
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
    <div className={cs('PageLoading', loading && 'visible')}>
      {/* <img
        src="https://steamuserimages-a.akamaihd.net/ugc/937207931810703613/95D27D6FD35BED1E307193EECC14B11D682E0615/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
        alt=""
      /> */}
    </div>
  );
};

export default PageLoading;
