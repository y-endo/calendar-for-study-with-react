import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import store from '~/stores';

import ResetStyle from '~/styles/reset';
import BaseStyle from '~/styles/base';
import theme from '~/styles/theme';

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  whyDidYouRender(React, {
    trackAllPureComponents: true
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ResetStyle />
      <BaseStyle />
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
