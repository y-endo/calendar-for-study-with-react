import type React from 'react';
import { MicroCMSListContent } from 'microcms-js-sdk';
import TSchedule from '~/types/Schedule';
import styled from 'styled-components';

type Props = {
  schedule?: (TSchedule & MicroCMSListContent)[];
  setIsModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalendarMonth: React.FC<Props> = ({ schedule, setIsModalShow }) => {
  const week = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const startDayOfWeek = new Date(year, month, 1).getDay();
  const endDate = new Date(year, month - 1, 0).getDate();
  const lastMonthEndDate = new Date(year, month, 0).getDate();
  const rowLength = Math.ceil((startDayOfWeek + endDate) / week.length);
  let count = 0;

  function handleItemClick() {
    if (setIsModalShow) {
      setIsModalShow(true);
    }
  }

  const weekView = (
    <StyledRow>
      {week.map((day, index) => (
        <th key={`day-${index}`}>
          <StyledWeekCell as={'span'}>{day}</StyledWeekCell>
        </th>
      ))}
    </StyledRow>
  );

  const rowView = [];
  for (let i = 0; i < rowLength; i++) {
    rowView.push(
      <StyledRow key={`row-${i}`}>
        {week.map((_, dayIndex) => {
          let dayNumber = -1;
          let isDisabled = false;
          let isToday = false;

          if (i == 0 && dayIndex < startDayOfWeek) {
            dayNumber = lastMonthEndDate - startDayOfWeek + dayIndex + 1;
            isDisabled = true;
          } else if (count >= endDate) {
            count++;
            dayNumber = count - endDate;
            isDisabled = true;
          } else {
            count++;
            if (year == today.getFullYear() && month == today.getMonth() && count == today.getDate()) {
              isToday = true;
            }
            dayNumber = count;
          }

          let badgeCount = 0;
          if (schedule) {
            schedule.forEach(item => {
              const date = new Date(item.date);
              if (year == date.getFullYear() && month == date.getMonth() && count == date.getDate()) {
                badgeCount++;
              }
            });
          }
          return (
            <td key={`date-${dayIndex}`}>
              <StyledCell disabled={isDisabled} today={isToday} onClick={handleItemClick}>
                <p>{dayNumber}</p>
                {badgeCount > 0 && <StyledBadge>{badgeCount}</StyledBadge>}
              </StyledCell>
            </td>
          );
        })}
      </StyledRow>
    );
  }

  return (
    <table>
      <thead>{weekView}</thead>
      <tbody>{rowView}</tbody>
    </table>
  );
};

const StyledRow = styled.tr`
  display: flex;
`;

const StyledCell = styled.button<{
  today?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  padding: 8px 10px;

  ${props =>
    props.today &&
    `
      background-color: ${props.theme.palette.primary.light};
    `}

  ${props =>
    props.disabled &&
    `
      background-color: #e0e0e0;
    `}
`;

const StyledWeekCell = styled(StyledCell)`
  align-items: center;
  justify-content: center;
  height: 30px;
`;

const StyledBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  background-color: ${props => props.theme.palette.primary.dark};
  font-size: 1rem;
`;

export default CalendarMonth;
