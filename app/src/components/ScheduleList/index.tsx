import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

import TSchedule from '~/types/Schedule';

import EditButton from '~/components/Button/edit';
import DeleteButton from '~/components/Button/delete';
import Flex from '~/components/Flex';
import Modal from '~/components/Modal';
import ScheduleSummary from '~/components/ScheduleSummary';

import { nowFetcher } from '~/utils/fetcher';
import { scheduleListMutate } from '~/utils/swrMutate';

/**
 * Props
 * data: microCMSから取得したデータ
 */
type Props = {
  data: TSchedule[];
};

/**
 * 予定一覧
 */
const ScheduleList: React.FC<Props> = React.memo(({ data }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const selectedId = React.useRef('');
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

  /**
   * 予定リストのクリックイベントハンドラ
   * @param event イベント引数
   */
  function handleScheduleClick(event: React.MouseEvent) {
    const id = event.currentTarget.getAttribute('data-id');
    if (id) {
      selectedId.current = id;
    }

    setIsUpdateModalOpen(true);
  }

  /**
   * 予定削除Submitのコールバック関数
   */
  const submitDeleteCallback = React.useCallback((isSuccess: boolean) => {
    if (isSuccess) {
      // 予定一覧ページに表示する予定を更新する。
      scheduleListMutate();
      // モーダルを閉じる
      setIsUpdateModalOpen(false);
    }
  }, []);

  return (
    <>
      <StyledScheduleList>
        <ul>
          {data.map((item, index) => {
            const itemDate = new Date(item.startDate);
            const year = itemDate.getFullYear();
            const month = String(itemDate.getMonth() + 1).padStart(2, '0');
            const date = String(itemDate.getDate()).padStart(2, '0');
            const day = ['日', '月', '火', '水', '木', '金', '土'][itemDate.getDay()];
            let isPast = false;

            if (now) {
              // 今日より過去の予定はグレーアウト
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
                <StyledTitle isImportant={item.isImportant} isPast={isPast} onClick={handleScheduleClick} data-id={item.id}>
                  {item.title}
                </StyledTitle>
              </li>
            );
          })}
        </ul>
      </StyledScheduleList>
      <Modal isOpen={isUpdateModalOpen} setIsOpen={setIsUpdateModalOpen}>
        <>
          <Flex alignItems="center" mb="15px">
            <EditButton contentId={selectedId.current} />
            <DeleteButton contentId={selectedId.current} submitCallback={submitDeleteCallback} />
          </Flex>
          <ScheduleSummary contentId={selectedId.current} />
        </>
      </Modal>
    </>
  );
});

ScheduleList.displayName = 'ScheduleList';

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledScheduleList = styled.div`
  > ul {
    li {
      display: flex;
      padding: 10px 15px;
      border-bottom: 1px solid #ccc;
    }
  }
`;

const StyledTime = styled.time`
  font-size: 1.4rem;
  white-space: nowrap;
  padding-top: 3px;
`;

const StyledTitle = styled.p<{ isImportant?: boolean; isPast?: boolean }>`
  font-size: 1.6rem;
  margin-left: 10px;
  cursor: pointer;

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
