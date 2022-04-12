import type React from 'react';
import TSchedule from '~/types/Schedule';
import styled from 'styled-components';
import ScheduleRegister from '~/components/ScheduleRegister';

type Props = {
  year: number;
  month: number;
  schedule?: TSchedule[];
};

const CalendarMonth: React.FC<Props> = props => {
  const week = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date();
  const year = props.year;
  const month = props.month;
  const startDayOfWeek = new Date(year, month - 1, 1).getDay();
  const endDate = new Date(year, month - 2, 0).getDate();
  const lastMonthEndDate = new Date(year, month, 0).getDate();
  const rowLength = Math.ceil((startDayOfWeek + endDate) / week.length);
  let count = 0;

  const weekView = (
    <StyledRow>
      {week.map((day, index) => (
        <th key={`day-${index}`}>
          <StyledWeekCell>{day}</StyledWeekCell>
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
          let isThisMonth = true;
          let isToday = false;

          if (i == 0 && dayIndex < startDayOfWeek) {
            dayNumber = lastMonthEndDate - startDayOfWeek + dayIndex + 1;
            isThisMonth = false;
          } else if (count >= endDate) {
            count++;
            dayNumber = count - endDate;
            isThisMonth = false;
          } else {
            count++;
            if (year == today.getFullYear() && month == today.getMonth() + 1 && count == today.getDate()) {
              isToday = true;
            }
            dayNumber = count;
          }

          let badgeCount = 0;
          if (props.schedule) {
            props.schedule.forEach(item => {
              const date = new Date(item.date);
              if (year == date.getFullYear() && month == date.getMonth() + 1 && count == date.getDate()) {
                badgeCount++;
              }
            });
          }
          return (
            <td key={`date-${dayIndex}`}>
              <StyledCell today={isToday} thisMonth={isThisMonth}>
                <p>{dayNumber}</p>
                {badgeCount > 0 && <StyledBadge>{badgeCount}</StyledBadge>}
                <ScheduleRegister date={`${year}-${String(month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`} />
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

const StyledCell = styled.div<{
  today?: boolean;
  thisMonth?: boolean;
}>`
  position: relative;
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  padding: 8px 10px;

  ${props =>
    props.today &&
    `
      background-color: ${props.theme.palette.primary.light};
    `}

  ${props =>
    props.thisMonth === false &&
    `
      background-color: #e0e0e0;
    `}
`;

const StyledWeekCell = styled(StyledCell)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
`;

const StyledBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 10px;
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
