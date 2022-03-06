import type React from 'react';
import styled from 'styled-components';
import { Button } from '~/components/common/Button';

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <h1>カレンダー</h1>
      <Button>今日</Button>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  display: flex;
  align-items: center;

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
`;

export default Header;
