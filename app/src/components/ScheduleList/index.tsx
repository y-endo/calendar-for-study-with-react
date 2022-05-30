import type React from 'react';
import styled from 'styled-components';

import TSchedule from '~/types/Schedule';

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
  return (
    <StyledScheduleList>
      <ul>
        {data.map((item, index) => {
          const dateObj = new Date(item.date);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const date = String(dateObj.getDate()).padStart(2, '0');
          return (
            <li key={`schedule-item-${index}`}>
              <StyledTime dateTime={`${year}-${month}-${date}`}>{`${year}-${month}-${date}`}</StyledTime>
              <StyledTitle isImportant={item.isImportant}>{item.title}</StyledTitle>
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
  width: 200px;
  padding: 10px;
  border: 1px solid #aaa;
  > ul {
    li {
      padding: 4px 6px;
      border-bottom: 1px solid #ccc;
      &:last-of-type {
        border-bottom: none;
      }
    }
  }
`;

const StyledTime = styled.time`
  font-size: 1.2rem;
`;

const StyledTitle = styled.p<{ isImportant?: boolean }>`
  font-size: 1.6rem;
  ${props =>
    props.isImportant &&
    `
    font-weight: bold;
  `}
`;

export default ScheduleList;
