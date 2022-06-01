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

  /**
   * スケジュール検索のsubmitイベントハンドラ
   * @param event
   */
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.target as typeof event.target & {
      query: { value: string };
    };
    const { query } = form;

    if (query.value === '') {
      router.push('/schedule/list/');
    } else {
      router.push(`/schedule/list/?q=${query.value}`);
    }
  }

  // カレンダーを表示しているページでは、日付変更のナビと現在の日付をヘッダーに表示する。
  let Nav = null; // ヘッダーのナビ（矢印）でカレンダーの月を移動
  let YearMonth = null; // 現在の年月
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

    YearMonth = (
      <StyledYearMonth>
        {year}年{month}月
      </StyledYearMonth>
    );
  }

  // スケジュールの検索窓
  const Search = (
    <StyledSearchContainer>
      <form onSubmit={handleSubmit}>
        <input type="text" name="query" placeholder="検索" />
        <Button>検索</Button>
      </form>
    </StyledSearchContainer>
  );

  return (
    <StyledHeader>
      <Link href="/">
        <a>
          <h1>カレンダー</h1>
        </a>
      </Link>
      <StyledTodayButton ml="20px">今日</StyledTodayButton>
      {Nav}
      {YearMonth}
      {Search}
    </StyledHeader>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 20px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;

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

const StyledYearMonth = styled.div`
  font-size: 1.8rem;
  margin-left: 15px;
`;

const StyledSearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  input {
    border: 1px solid #ccc;
    padding: 5px 8px;
  }

  ${Button} {
    margin-left: 10px;
  }
`;

export default Header;
