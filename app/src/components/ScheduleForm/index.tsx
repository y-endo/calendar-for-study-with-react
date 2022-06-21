import React from 'react';
import styled from 'styled-components';

import { useForm, SubmitHandler } from 'react-hook-form';

import Button from '~/components/Button';
import Flex from '~/components/Flex';

import { Margin } from '~/utils/style';

export interface IScheduleFormInput {
  startDate: string;
  endDate?: string;
  title: string;
  place?: string;
  isImportant?: boolean;
  description?: string;
}

/**
 * Props
 * date: 予定を登録する日時
 */
type Props = {
  disabled?: boolean;
  defaultValue?: {
    startDate?: string;
    endDate?: string;
    title?: string;
    place?: string;
    isImportant?: boolean;
    description?: string;
  };
  submitText?: string;
  submitCallback?: (data: IScheduleFormInput) => void;
};

/**
 * 予定を登録するフォーム
 */
const ScheduleForm: React.FC<Props> = ({ disabled, defaultValue, submitText = '登録', submitCallback }) => {
  const [isEndDateVisible, setIsEndDateVisible] = React.useState(typeof defaultValue?.endDate === 'string');
  const { register, handleSubmit } = useForm<IScheduleFormInput>();

  /**
   * 終了日時を追加するクリック
   */
  function handleAddEndDateClick() {
    setIsEndDateVisible(true);
  }

  /**
   * 終了日時を削除するクリック
   */
  function handleDeleteEndDateClick() {
    setIsEndDateVisible(false);
  }

  /**
   * 登録サブミットイベントハンドラ
   * 入力バリデーションを行い、propsのsubmitCallbackにデータを渡す。
   * @param data
   */
  const onSubmit: SubmitHandler<IScheduleFormInput> = async data => {
    const { startDate, endDate } = data;

    // 日時をdatetime-localで入力しているので、データ送信前にタイムゾーンの設定を行う。（-9時間）
    data = {
      ...data,
      startDate: `${startDate}:00+09:00`,
      endDate: endDate ? `${endDate}:00+09:00` : undefined
    };
    // 終了日時を非表示にしている場合は登録データから削除
    if (!isEndDateVisible) {
      data.endDate = undefined;
    }

    if (submitCallback) {
      submitCallback(data);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} disabled={disabled}>
      <StyledFieldSet>
        <legend>
          日時<span>必須</span>
        </legend>
        <Flex alignItems="center">
          <input type="datetime-local" {...register('startDate', { required: true })} defaultValue={defaultValue?.startDate || ''} />
          {!isEndDateVisible && (
            <Button size="small" type="button" mt="8px" ml="10px" onClick={handleAddEndDateClick}>
              終了日時を追加する
            </Button>
          )}
        </Flex>
        {isEndDateVisible && (
          <StyledEndDate>
            <Flex alignItems="center">
              <input type="datetime-local" {...register('endDate')} defaultValue={defaultValue?.endDate || defaultValue?.startDate || ''} />
              <Button size="small" type="button" mt="8px" ml="10px" onClick={handleDeleteEndDateClick}>
                終了日時を削除する
              </Button>
            </Flex>
          </StyledEndDate>
        )}
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>
          タイトル<span>必須</span>
        </legend>
        <input type="text" {...register('title', { required: true })} defaultValue={defaultValue?.title} />
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>場所</legend>
        <input type="text" {...register('place')} defaultValue={defaultValue?.place} />
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>重要な予定</legend>
        <input type="checkbox" {...register('isImportant')} defaultChecked={defaultValue?.isImportant} />
      </StyledFieldSet>
      <StyledFieldSet>
        <legend>説明</legend>
        <textarea {...register('description')} defaultValue={defaultValue?.description}></textarea>
      </StyledFieldSet>
      <Margin mt={'20px'}>
        <Button>{submitText}</Button>
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
  font-size: 1.6rem;
  margin-top: 15px;

  &:first-of-type {
    margin-top: 0;
  }

  legend {
    font-weight: bold;
    > span {
      margin-left: 8px;
      color: red;
    }
  }
  input:not([type='checkbox']),
  textarea {
    width: 100%;
    border: 1px solid #ccc;
    margin-top: 8px;
    padding: 5px;
  }
`;

const StyledEndDate = styled.div`
  &::before {
    content: '';
    display: block;
    height: 12px;
    margin: 8px auto 0 30px;
    border-left: 1px solid #ccc;
  }
`;

export default ScheduleForm;
