import React, { FormEvent } from 'react';
import styled from 'styled-components';
import Modal from '~/components/Modal';
import { Button } from '~/components/common/Button';
import { Margin } from '~/utils/style';
import TSchedule from '~/types/Schedule';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/stores';
import { addList } from '~/stores/message';

type Props = {
  date?: string;
};

const registerSchedule = (data: TSchedule) => {
  return fetch('https://calendar.microcms.io/api/v1/schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': process.env.API_KEY || ''
    },
    body: JSON.stringify(data)
  });
};

const ScheduleRegister: React.FC<Props> = ({ date }) => {
  const hasDateProps = typeof date === 'string' && date !== '';
  const [isModalShow, setIsModalShow] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  function handleClick() {
    setIsModalShow(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
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
          text: `${date.value}の予定を登録しました`,
          autoDelete: true,
          autoDeleteTime: 4000
        })
      );
    }
    setIsFetching(false);
  }

  return (
    <Margin mt={10}>
      <Button size="small" onClick={handleClick}>
        予定を登録する
      </Button>
      <Modal isShow={isModalShow} setIsShow={setIsModalShow}>
        <StyledForm onSubmit={handleSubmit} disabled={isFetching}>
          <StyledFieldSet>
            <legend>
              日時<span>必須</span>
            </legend>
            <input type="date" name="date" readOnly={hasDateProps} value={date} />
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
          <Margin mt={20}>
            <Button>登録</Button>
          </Margin>
        </StyledForm>
      </Modal>
    </Margin>
  );
};

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

export default ScheduleRegister;
