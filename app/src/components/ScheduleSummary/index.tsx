import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

import { scheduleFetcher } from '~/utils/fetcher';
import formatDate from '~/utils/formatDate';

/**
 * Props
 * contentId: microCMSに登録されているID
 */
type Props = {
  contentId: string;
};

/**
 * 予定概要
 */
const ScheduleSummary: React.FC<Props> = ({ contentId }) => {
  const { data, error } = useSWR(['schedule', contentId], scheduleFetcher, {
    revalidateIfStale: false, // 古いデータがある場合に自動再検証
    revalidateOnFocus: false, // ウィンドウがフォーカスされたときに自動的に再検証
    revalidateOnReconnect: false // ブラウザがネットワーク接続を回復すると自動的に再検証
  });

  // 予定データの取得に失敗
  if (error) {
    return <p>エラー</p>;
  }

  // 予定データの取得に成功
  if (data) {
    const startDate = formatDate(new Date(data.startDate));
    let endDate = null;
    if (data.endDate) {
      endDate = formatDate(new Date(data.endDate));
    }
    return (
      <StyledDetail>
        {data.isImportant && <StyledImportantText>重要な予定</StyledImportantText>}
        <StyledDl>
          <dt>タイトル</dt>
          <dd>{data.title}</dd>
        </StyledDl>
        <StyledDl>
          <dt>日時</dt>
          <dd>
            {startDate.string.replace('T', ' ')}
            {endDate && (
              <>
                <br />〜<br />
                {endDate.string.replace('T', ' ')}
              </>
            )}
          </dd>
        </StyledDl>
        {data.place && (
          <StyledDl>
            <dt>場所</dt>
            <dd>{data.place}</dd>
          </StyledDl>
        )}
        {data.description && (
          <StyledDl>
            <dt>説明</dt>
            <dd>{data.description}</dd>
          </StyledDl>
        )}
      </StyledDetail>
    );
  }

  return <p>読込中</p>;
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledDetail = styled.div`
  position: relative;
  width: 300px;
`;

const StyledImportantText = styled.strong`
  display: inline-block;
  color: ${props => props.theme.palette.primary.dark};
  font-weight: bold;
  margin-bottom: 10px;
`;

const StyledDl = styled.dl`
  display: flex;
  margin-bottom: 10px;
  font-size: 1.5rem;
  &:last-of-type {
    margin-bottom: 0;
  }
  dt {
    width: 80px;
    flex: 0 0 80px;
  }
`;

export default ScheduleSummary;
