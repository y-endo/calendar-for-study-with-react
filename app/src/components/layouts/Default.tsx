import type React from 'react';
import Header from '~/components/common/Header';

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default DefaultLayout;
