import React from 'react';
import styled from 'styled-components';
import { NextPage, InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { MicroCMSListContent, MicroCMSListResponse } from 'microcms-js-sdk';

import TSchedule from '~/types/Schedule';

import DefaultLayout from '~/components/layouts/Default';
import ScheduleForm, { IScheduleFormInput } from '~/components/ScheduleForm';

import { AppDispatch } from '~/stores';
import { addMessage } from '~/stores/message';

import { patchSchedule, microCMSClient } from '~/utils/microCMS';
import formatDate from '~/utils/formatDate';

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
  // 予定データ全取得
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

/**
 * 予定詳細（編集）ページ
 */
const SchedulePage: NextPage<Props> = ({ schedule }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const startDate = formatDate(new Date(schedule.startDate));
  const endDate = schedule.endDate ? formatDate(new Date(schedule.endDate)) : null;
  const dispatch = useDispatch<AppDispatch>();

  // ScheduleFormに渡すmicroCMS登録データ
  const defaultValue = {
    startDate: startDate.string,
    endDate: endDate ? endDate.string : '',
    title: schedule.title,
    place: schedule.place || '',
    isImportant: schedule.isImportant || false,
    description: schedule.description || ''
  };

  /**
   * 予定更新Submitのコールバック関数
   */
  const submitCallback = React.useCallback(
    async (data: IScheduleFormInput) => {
      setIsSubmitting(true);

      // microCMSの予定を更新する（PATCH）
      const posted = await patchSchedule(schedule.id, data);
      if (posted.status === 200) {
        // 成功のメッセージを表示
        dispatch(
          addMessage({
            id: new Date().getTime(),
            text: `予定を更新しました`,
            autoDelete: true,
            autoDeleteTime: 4000
          })
        );
      }

      setIsSubmitting(false);
    },
    [schedule.id, dispatch]
  );

  return (
    <DefaultLayout>
      <Head>
        <title>{schedule.title}</title>
      </Head>
      <StyledFormContainer>
        <ScheduleForm disabled={isSubmitting} defaultValue={defaultValue} submitText="更新" submitCallback={submitCallback} />
      </StyledFormContainer>
    </DefaultLayout>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledFormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
`;

export default SchedulePage;
