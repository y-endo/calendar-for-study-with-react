import React from 'react';
import styled from 'styled-components';
import { Button } from '~/components/common/Button';
import { Margin } from '~/utils/style';
import { addList } from '~/stores/message';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/stores';
import { useSWRConfig } from 'swr';
import TSchedule from '~/types/Schedule';

type Props = {
  date?: string;
  closeParentModal?: Function;
};

/**
 * スケジュールを登録するフォーム
 * @param param0
 * @returns
 */
const ScheduleForm: React.FC<Props> = ({ date, closeParentModal }) => {
  const hasDateProps = typeof date === 'string' && date !== '';
  const { mutate } = useSWRConfig();
  const [isFetching, setIsFetching] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  function registerSchedule(data: Omit<TSchedule, 'id'>) {
    return fetch('https://calendar.microcms.io/api/v1/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': process.env.API_KEY || ''
      },
      body: JSON.stringify(data)
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    let isSuccess = false;
    const form = event.target as typeof event.target & {
      date: { value: string };
      title: { value: string };
      place: { value: string };
      isImportant: { checked: boolean };
      description: { value: string };
    };
    const { date, title, place, isImportant, description } = form;

    if (date.value === '' || title.value === '') return;

    setIsFetching(true);
    const registered = await registerSchedule({
      date: date.value,
      title: title.value,
      place: place.value,
      isImportant: isImportant.checked,
      description: description.value
    });
    if (registered.status === 201) {
      dispatch(
        addList({
          id: new Date().getTime(),
          text: `${date.value}に${title.value}の予定を登録しました`,
          autoDelete: true,
          autoDeleteTime: 4000
        })
      );
      isSuccess = true;
      mutate('schedule');
    }
    setIsFetching(false);

    if (isSuccess && closeParentModal) {
      closeParentModal();
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit} disabled={isFetching}>
      <StyledFieldSet>
        <legend>
          日時<span>必須</span>
        </legend>
        {hasDateProps ? <input type="date" name="date" readOnly value={date} /> : <input type="date" name="date" />}
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>
          タイトル<span>必須</span>
        </legend>
        <input type="text" name="title" />
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>場所</legend>
        <input type="text" name="place" />
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>重要な予定</legend>
        <input type="checkbox" name="isImportant" />
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>説明</legend>
        <textarea name="description"></textarea>
      </StyledFieldSet>
      <Margin mt={'20px'}>
        <Button>登録</Button>
      </Margin>
    </StyledForm>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledForm = styled.form<{
  disabled?: boolean;
}>`
  position: relative;

  ${props =>
    props.disabled &&
    `
      opacity: 0.5;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
      }
    `}
`;

const StyledFieldSet = styled.fieldset`
  display: flex;
  align-items: flex-start;
  font-size: 1.6rem;
  margin-top: 15px;

  &:first-of-type {
    margin-top: 0;
  }

  > legend {
    font-weight: bold;
    width: 150px;
    > span {
      margin-left: 8px;
      color: red;
    }
  }
  > :is(input, textarea) {
    border: 1px solid #ccc;
    margin-top: 8px;
  }
`;

export default ScheduleForm;
