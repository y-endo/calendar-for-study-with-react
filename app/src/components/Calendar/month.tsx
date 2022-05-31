import React from 'react';
import styled from 'styled-components';

import TSchedule from '~/types/Schedule';

import { Button } from '~/components/common/Button';
import Modal from '~/components/Modal';
import ScheduleForm from '~/components/ScheduleForm';
import ScheduleDetail from '~/components/ScheduleDetail';

import { Margin } from '~/utils/style';

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
  const selectedDate = React.useRef('');
  const selectedId = React.useRef('');
  const week = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date();
  const year = props.year;
  const month = props.month;
  const startDayOfWeek = new Date(year, month - 1, 1).getDay();
  const endDate = new Date(year, month - 2, 0).getDate();
  const lastMonthEndDate = new Date(year, month, 0).getDate();
  const rowLength = 6; // 行の数を6で固定する
  let count = 0; // 月カレンダー表を作成するループ中の現在位置

  /**
   * 予定を登録するボタンのクリックイベントハンドラ
   * @param event イベント引数
   */
  function handleRegisterClick(event: React.MouseEvent) {
    const date = event.currentTarget.closest('[data-date]')?.getAttribute('data-date');
    if (date) {
      selectedDate.current = date;
    }

    setIsRegisterModalOpen(true);
  }

  /**
   * カレンダー表上の予定リストのクリックイベントハンドラ
   * @param event イベント引数
   */
  function handleScheduleClick(event: React.MouseEvent) {
    const date = event.currentTarget.closest('[data-date]')?.getAttribute('data-date');
    if (date) {
      selectedDate.current = date;
    }

    const id = event.currentTarget.getAttribute('data-id');
    if (id) {
      selectedId.current = id;
    }

    setIsUpdateModalOpen(true);
  }

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
  const bodyView = [];
  for (let i = 0; i < rowLength; i++) {
    bodyView.push(
      <StyledRow key={`row-${i}`}>
        {week.map((_, dayIndex) => {
          let currentDayNumber = -1;
          let isThisMonth = true;
          let isToday = false;

          if (i == 0 && dayIndex < startDayOfWeek) {
            // 先月末の日にち
            currentDayNumber = lastMonthEndDate - startDayOfWeek + dayIndex + 1;
            isThisMonth = false;
          } else if (count >= endDate) {
            // 来月頭の日にち
            count++;
            currentDayNumber = count - endDate;
            isThisMonth = false;
          } else {
            // 今月の日にち
            count++;
            if (year == today.getFullYear() && month == today.getMonth() + 1 && count == today.getDate()) {
              isToday = true;
            }
            currentDayNumber = count;
          }

          // カレンダーのマスに表示するスケジュール一覧
          const scheduleList: JSX.Element[] = [];
          if (props.schedule) {
            props.schedule.forEach(item => {
              const date = new Date(item.date);
              if (year == date.getFullYear() && month == date.getMonth() + 1 && currentDayNumber == date.getDate()) {
                scheduleList.push(
                  <StyledScheduleItem key={`item-${item.id}`} isImportant={item.isImportant} data-id={item.id} onClick={handleScheduleClick}>
                    {item.title}
                  </StyledScheduleItem>
                );
              }
            });
          }

          return (
            <StyledCell key={`date-${dayIndex}`}>
              <StyledCellContent
                today={isToday}
                thisMonth={isThisMonth}
                data-date={`${year}-${String(month).padStart(2, '0')}-${String(currentDayNumber).padStart(2, '0')}`}
              >
                <StyledDayNumber>{currentDayNumber}</StyledDayNumber>
                {scheduleList.length > 0 && <StyledScheduleList>{scheduleList}</StyledScheduleList>}
                <Margin mt="auto" mr="auto" ml="auto">
                  <Button size="small" onClick={handleRegisterClick}>
                    予定を登録する
                  </Button>
                </Margin>
              </StyledCellContent>
            </StyledCell>
          );
        })}
      </StyledRow>
    );
  }

  return (
    <>
      <StyledTable>
        <thead>{weekView}</thead>
        <tbody>{bodyView}</tbody>
      </StyledTable>
      <Modal isOpen={isRegisterModalOpen} setIsOpen={setIsRegisterModalOpen}>
        <ScheduleForm date={selectedDate.current} />
      </Modal>
      <Modal isOpen={isUpdateModalOpen} setIsOpen={setIsUpdateModalOpen}>
        <ScheduleDetail contentId={selectedId.current} />
      </Modal>
    </>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledTable = styled.table`
  width: 100%;
  height: 100%;
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

export default CalendarMonth;
