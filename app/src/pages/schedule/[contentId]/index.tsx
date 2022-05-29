import React from 'react';
import styled from 'styled-components';
import { Button } from '~/components/common/Button';
import { Margin } from '~/utils/style';
import { NextPage, InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next';
import { MicroCMSListContent, MicroCMSListResponse } from 'microcms-js-sdk';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/stores';
import { addMessage } from '~/stores/message';
import microCMSClient from '~/utils/microCMSClient';
import TSchedule from '~/types/Schedule';
import Head from 'next/head';
import DefaultLayout from '~/components/layouts/Default';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const schedule = await microCMSClient.get<MicroCMSListContent & TSchedule>({
    endpoint: 'schedule',
    contentId: params ? String(params.contentId) : ''
  });

  return {
    props: {
      schedule
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const isProd = process.env.NODE_ENV === 'production';
  // スケジュールデータ全取得
  const schedule = await microCMSClient.get<MicroCMSListResponse<TSchedule>>({
    endpoint: 'schedule'
  });

  // 取得したデータのIDからページのパスを作成
  const paths = schedule.contents.map(data => {
    return {
      params: {
        contentId: data.id
      }
    };
  });

  return {
    paths,
    fallback: isProd ? false : 'blocking'
  };
};

const SchedulePage: NextPage<Props> = ({ schedule }) => {
  const [isFetching, setIsFetching] = React.useState(false);
  const date = new Date(schedule.date);
  const dispatch = useDispatch<AppDispatch>();

  function updateSchedule(data: Omit<TSchedule, 'id'>) {
    return fetch(`https://calendar.microcms.io/api/v1/schedule/${schedule.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': process.env.API_KEY || ''
      },
      body: JSON.stringify(data)
    });
  }

  async function handleSubmit(event: React.FormEvent) {
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
    const updated = await updateSchedule({
      date: date.value,
      title: title.value,
      place: place.value,
      isImportant: isImportant.checked,
      description: description.value
    });
    if (updated.status === 200) {
      dispatch(
        addMessage({
          id: new Date().getTime(),
          text: `予定を更新しました`,
          autoDelete: true,
          autoDeleteTime: 4000
        })
      );
    }
    setIsFetching(false);
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{schedule.title}</title>
      </Head>
      <StyledDetail>
        <StyledForm onSubmit={handleSubmit} disabled={isFetching}>
          <StyledFieldSet>
            <legend>
              日時<span>必須</span>
            </legend>
            <input
              type="date"
              name="date"
              defaultValue={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`}
            />
          </StyledFieldSet>
          <StyledFieldSet>
            <legend>
              タイトル<span>必須</span>
            </legend>
            <input type="text" name="title" defaultValue={schedule.title} />
          </StyledFieldSet>
          <StyledFieldSet>
            <legend>場所</legend>
            <input type="text" name="place" defaultValue={schedule.place || ''} />
          </StyledFieldSet>
          <StyledFieldSet>
            <legend>重要な予定</legend>
            <input type="checkbox" name="isImportant" defaultChecked={schedule.isImportant || false} />
          </StyledFieldSet>
          <StyledFieldSet>
            <legend>説明</legend>
            <textarea name="description" defaultValue={schedule.description || ''}></textarea>
          </StyledFieldSet>
          <Margin mt={'20px'}>
            <Button>更新</Button>
          </Margin>
        </StyledForm>
      </StyledDetail>
    </DefaultLayout>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledDetail = styled.div`
  position: relative;
  padding: 0 20px;
`;

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

export default SchedulePage;
