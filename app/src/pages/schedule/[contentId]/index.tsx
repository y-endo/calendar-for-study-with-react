import React from 'react';
import styled from 'styled-components';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import DefaultLayout from '~/components/layouts/Default';
import ScheduleForm, { IScheduleFormInput } from '~/components/ScheduleForm';
import Button from '~/components/Button';

import { AppDispatch } from '~/stores';
import { addMessage } from '~/stores/message';

import { patchSchedule } from '~/utils/microCMS';
import formatDate from '~/utils/formatDate';
import { scheduleFetcher } from '~/utils/fetcher';

/**
 * 予定詳細（編集）ページ
 */
const SchedulePage: NextPage | null = () => {
  const router = useRouter();
  const contentId = router.query.contentId as string;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { data: schedule, error: scheduleError } = useSWR(['schedule', contentId], scheduleFetcher, {
    revalidateIfStale: false, // 古いデータがある場合に自動再検証
    revalidateOnFocus: false, // ウィンドウがフォーカスされたときに自動的に再検証
    revalidateOnReconnect: false // ブラウザがネットワーク接続を回復すると自動的に再検証
  });
  const dispatch = useDispatch<AppDispatch>();

  /**
   * 予定更新Submitのコールバック関数
   */
  const submitCallback = React.useCallback(
    async (data: IScheduleFormInput) => {
      setIsSubmitting(true);

      // microCMSの予定を更新する（PATCH）
      const posted = await patchSchedule(contentId, data);
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
    [contentId, dispatch]
  );

  if (!router.isReady || !schedule) return null;
  if (scheduleError) {
    return <div>通信エラー</div>;
  }

  const startDate = formatDate(new Date(schedule.startDate));
  const endDate = schedule.endDate ? formatDate(new Date(schedule.endDate)) : null;

  // ScheduleFormに渡すmicroCMS登録データ
  const defaultValue = {
    startDate: startDate.string,
    endDate: endDate ? endDate.string : '',
    title: schedule.title,
    place: schedule.place || '',
    isImportant: schedule.isImportant || false,
    description: schedule.description || ''
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{schedule.title}</title>
      </Head>
      <StyledFormContainer>
        <ScheduleForm disabled={isSubmitting} defaultValue={defaultValue} submitText="更新" submitCallback={submitCallback} />
        <Button mt="30px" onClick={() => router.back()}>
          戻る
        </Button>
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
