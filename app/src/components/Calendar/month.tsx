import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import TSchedule from '~/types/Schedule';

import Button from '~/components/Button';
import EditButton from '~/components/Button/edit';
import DeleteButton from '~/components/Button/delete';
import Flex from '~/components/Flex';
import Modal from '~/components/Modal';
import ScheduleForm, { IScheduleFormInput } from '~/components/ScheduleForm';
import ScheduleSummary from '~/components/ScheduleSummary';

import { AppDispatch } from '~/stores';
import { addMessage } from '~/stores/message';

import getMonthCalendarData, { TMonthCalendar } from '~/utils/getMonthCalendarData';
import { nowFetcher } from '~/utils/fetcher';
import { postSchedule } from '~/utils/microCMS';
import { monthScheduleMutate } from '~/utils/swrMutate';
import arrayChunk from '~/utils/arrayChunk';
import formatDate from '~/utils/formatDate';

/**
 * Props
 * year: カレンダーの年
 * month: カレンダーの月
 * schedule: 予定一覧データ
 */
type Props = {
  year: number;
  month: number;
  schedule?: TSchedule[];
};

/**
 * 月カレンダー表
 * @param props
 */
const CalendarMonth: React.FC<Props> = props => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const selectedDate = React.useRef('');
  const selectedId = React.useRef('');
  let { data: now, error: nowError } = useSWR('/api/now', nowFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const calendarDataArray = arrayChunk(getMonthCalendarData(props.year, props.month), 7);
  const week = ['日', '月', '火', '水', '木', '金', '土'];
  const dispatch = useDispatch<AppDispatch>();

  // サーバー（API）から今日の日付を取得、失敗した場合はローカル時間。
  if (nowError) {
    const nowDate = new Date();
    now = {
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate()
    };
  }

  /**
   * 予定を登録するボタンのクリックイベントハンドラ
   * @param event イベント引数
   */
  function handleRegisterClick(event: React.MouseEvent) {
    const date = event.currentTarget.closest('[data-date]')?.getAttribute('data-date');
    if (date) {
      selectedDate.current = `${date}T00:00`;
    }

    setIsRegisterModalOpen(true);
  }

  /**
   * カレンダー表上の予定クリックイベントハンドラ
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
   * 予定登録Submitのコールバック関数
   */
  const submitRegisterCallback = React.useCallback(
    async (data: IScheduleFormInput) => {
      setIsSubmitting(true);

      // microCMSに予定を登録する（POST）
      let isSuccess = false;
      const { startDate, title } = data;
      const posted = await postSchedule(data);
      setIsSubmitting(false);
      if (posted.status === 201) {
        // 成功のメッセージを表示
        dispatch(
          addMessage({
            id: new Date().getTime(),
            text: `${startDate.replace(/T.*/, '')}に${title}の予定を登録しました`,
            autoDelete: true,
            autoDeleteTime: 4000
          })
        );
        isSuccess = true;

        // 月カレンダーページに表示する予定を更新する。
        monthScheduleMutate();
      }

      // データ登録に成功した場合はモーダルを閉じる
      if (isSuccess) {
        setIsRegisterModalOpen(false);
      }
    },
    [dispatch]
  );

  /**
   * 予定削除Submitのコールバック関数
   */
  const submitDeleteCallback = React.useCallback((isSuccess: boolean) => {
    if (isSuccess) {
      // 月カレンダーページに表示する予定を更新する。
      monthScheduleMutate();
      // モーダルを閉じる
      setIsUpdateModalOpen(false);
    }
  }, []);

  // 表の1行目に曜日を表示
  const weekView = (
    <StyledRowWeek>
      {week.map((day, index) => (
        <StyledCell as="th" key={`day-${index}`}>
          <StyledCellContent>{day}</StyledCellContent>
        </StyledCell>
      ))}
    </StyledRowWeek>
  );

  // カレンダーの表を作成
  const bodyView: JSX.Element[] = [];
  calendarDataArray.forEach((calendarData: TMonthCalendar[], i) => {
    bodyView.push(
      <StyledRow key={`row-${i}`}>
        {calendarData.map(({ year, month, date }, index) => {
          const datasetDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
          const isToday = now && year === now.year && month === now.month && date === now.date;

          // カレンダーのマスに表示する予定一覧
          const scheduleList: JSX.Element[] = [];
          if (props.schedule) {
            props.schedule.forEach(item => {
              const scheduleDate = formatDate(new Date(item.startDate));
              const isMatch = datasetDate === scheduleDate.string.replace(/T.*/, '');
              if (isMatch) {
                scheduleList.push(
                  <StyledScheduleItem key={`item-${item.id}`} isImportant={item.isImportant} data-id={item.id} onClick={handleScheduleClick}>
                    {item.title}
                  </StyledScheduleItem>
                );
              }
            });
          }

          return (
            <StyledCell key={`date-${index}`}>
              <StyledCellContent today={isToday} thisMonth={month === props.month} data-date={datasetDate}>
                <StyledDayNumber>{date}</StyledDayNumber>
                {scheduleList.length > 0 && <StyledScheduleList>{scheduleList}</StyledScheduleList>}
                <Button size="small" mt="auto" mr="auto" ml="auto" onClick={handleRegisterClick}>
                  予定を登録する
                </Button>
              </StyledCellContent>
            </StyledCell>
          );
        })}
      </StyledRow>
    );
  });

  return (
    <>
      <StyledTable>
        <StyledTableHead>{weekView}</StyledTableHead>
        <StyledTableBody>{bodyView}</StyledTableBody>
      </StyledTable>
      <Modal isOpen={isRegisterModalOpen} setIsOpen={setIsRegisterModalOpen}>
        <StyledFormContainer>
          <ScheduleForm disabled={isSubmitting} defaultValue={{ startDate: selectedDate.current }} submitCallback={submitRegisterCallback} />
        </StyledFormContainer>
      </Modal>
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
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledTable = styled.table`
  display: block;
  width: 100%;
  height: 100%;
`;

const StyledTableHead = styled.thead`
  display: block;
  height: 30px;
`;

const StyledTableBody = styled.tbody`
  display: block;
  height: calc(100% - 30px); // -30px = thead
`;

const StyledRow = styled.tr`
  display: flex;
  height: calc(100% / 6);
  border-top: 1px solid #ccc;
`;

const StyledCell = styled.td`
  width: calc(100% / 7);
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;

  & + & {
    border-left: none;
  }
`;

const StyledCellContent = styled.div<{
  today?: boolean;
  thisMonth?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px 10px;

  ${props =>
    props.today &&
    `
      background-color: ${props.theme.palette.secondary.light};
    `}

  ${props =>
    props.thisMonth === false &&
    `
      background-color: #e0e0e0;
    `}
`;

const StyledRowWeek = styled(StyledRow)`
  border-top: none;

  ${StyledCell} {
    height: 30px;
    border-top: none;
  }

  ${StyledCellContent} {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;

const StyledDayNumber = styled.p`
  font-size: 1.3rem;
  line-height: 1;
  text-align: center;
`;

const StyledScheduleList = styled.ul`
  height: calc(24px * 3);
  margin: 5px 0;
  overflow: auto;
`;

const StyledScheduleItem = styled.li<{
  isImportant?: boolean;
}>`
  font-size: 1.2rem;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 20px;
  padding: 0 4px;
  margin: 4px 0;
  background-color: ${props => (props.isImportant ? props.theme.palette.primary.dark : props.theme.palette.primary.light)};
  color: #fff;
  cursor: pointer;
`;

const StyledFormContainer = styled.div`
  width: 420px;
`;

export default CalendarMonth;
