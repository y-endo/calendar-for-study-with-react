import type React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '~/components/common/Button';

import { Margin } from '~/utils/style';

/**
 * 共通ヘッダー
 */
const Header: React.FC = () => {
  const router = useRouter();
  const { year, month } = router.query;

  // ヘッダーのナビ（矢印）でカレンダーの月を移動
  let Nav = null;
  if (year && month) {
    const yearNumber = parseInt(year as string, 10);
    const monthNumber = parseInt(month as string, 10);
    let prevURL = `/calendar/${yearNumber}/${monthNumber - 1}`;
    let nextURL = `/calendar/${yearNumber}/${monthNumber + 1}`;

    if (monthNumber === 1) {
      prevURL = `/calendar/${yearNumber - 1}/12`;
    } else if (monthNumber === 12) {
      nextURL = `/calendar/${yearNumber + 1}/1`;
    }

    Nav = (
      <StyledNav>
        <Link href={prevURL} passHref>
          <StyledArrow direction="left" />
        </Link>
        <Link href={nextURL} passHref>
          <StyledArrow />
        </Link>
      </StyledNav>
    );
  }

  return (
    <StyledHeader>
      <h1>カレンダー</h1>
      <StyledTodayButton ml="20px">今日</StyledTodayButton>
      {Nav}
    </StyledHeader>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 20px;

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
`;

const StyledTodayButton = Margin.withComponent(Button);

const StyledNav = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const StyledArrow = styled.button<{ direction?: string }>`
  width: 15px;
  height: 15px;
  margin: 0 10px;
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  transform: ${props => (props.direction === 'left' ? 'rotate(-135deg)' : 'rotate(45deg)')};
`;

export default Header;
