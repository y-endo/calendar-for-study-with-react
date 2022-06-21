import type React from 'react';

import Header from '~/components/Header';
import MessageList from '~/components/MessageList';

/**
 * デフォルトレイアウト
 */
const DefaultLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <aside>
        <MessageList />
      </aside>
    </>
  );
};

export default DefaultLayout;
