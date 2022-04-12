import type React from 'react';
import Header from '~/components/common/Header';
import MessageList from '~/components/MessageList';

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