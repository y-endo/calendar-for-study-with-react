import type React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

import TSchedule from '~/types/Schedule';
import type { TNow } from '~/pages/api/now';

/**
 * 今日の日付を取得する
 * @param endpoint
 */
const nowFetcher = (endpoint: string): Promise<TNow> => fetch(endpoint).then(res => res.json());

/**
 * Props
 * data: microCMSから取得したデータ
 */
type Props = {
  data: TSchedule[];
};

/**
 * スケジュール一覧
 */
const ScheduleList: React.FC<Props> = ({ data }) => {
  let { data: now, error: nowError } = useSWR('/api/now', nowFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  // サーバー（API）から今日の日付を取得、失敗した場合はローカル時間。
  if (nowError) {
    const nowDate = new Date();
    now = {
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate(),
      day: nowDate.getDay(),
      hours: nowDate.getHours(),
      minutes: nowDate.getMinutes(),
      seconds: nowDate.getSeconds()
    };
  }

  return (
    <StyledScheduleList>
      <ul>
        {data.map((item, index) => {
          const itemDate = new Date(item.date);
          const year = itemDate.getFullYear();
          const month = String(itemDate.getMonth() + 1).padStart(2, '0');
          const date = String(itemDate.getDate()).padStart(2, '0');
          const day = ['日', '月', '火', '水', '木', '金', '土'][itemDate.getDay()];
          let isPast = false;

          if (now) {
            // 今日より過去のスケジュールはグレーアウト
            if (
              itemDate.getTime() <
              new Date(
                `${now.year}-${String(now.month).padStart(2, '0')}-${String(now.date).padStart(2, '0')} ${now.hours}:${now.minutes}:${now.seconds}`
              ).getTime()
            ) {
              isPast = true;
            }
          }

          return (
            <li key={`schedule-item-${index}`}>
              <StyledTime dateTime={`${year}-${month}-${date}`}>{`${year}年${month}月${date}日（${day}）`}</StyledTime>
              <StyledTitle isImportant={item.isImportant} isPast={isPast}>
                {item.title}
              </StyledTitle>
            </li>
          );
        })}
      </ul>
    </StyledScheduleList>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledScheduleList = styled.div`
  > ul {
    li {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid #ccc;
    }
  }
`;

const StyledTime = styled.time`
  font-size: 1.4rem;
  white-space: nowrap;
`;

const StyledTitle = styled.p<{ isImportant?: boolean; isPast?: boolean }>`
  font-size: 1.6rem;
  margin-left: 10px;

  ${props =>
    props.isImportant &&
    `
    font-weight: bold;
    color: ${props.theme.palette.primary.dark};
  `}

  ${props =>
    props.isPast &&
    `
    color: #9f9f9f;
  `}
`;

export default ScheduleList;
