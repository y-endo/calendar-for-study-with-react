import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

import ResetStyle from '~/styles/reset';
import BaseStyle from '~/styles/base';
import theme from '~/styles/theme';
import store from '~/stores';

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
