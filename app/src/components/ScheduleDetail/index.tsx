import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { MicroCMSListContent } from 'microcms-js-sdk';
import TSchedule from '~/types/Schedule';
import microCMSClient from '~/utils/microCMSClient';
import { Button } from '~/components/common/Button';
import { addList } from '~/stores/message';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/stores';

type Props = {
  contentId: string;
  closeParentModal?: Function;
};

/**
 * スケジュールデータ1件を取得する
 * @param endpoint
 * @param contentId
 * @returns
 */
const fetcher = (endpoint: string, contentId: string) => microCMSClient.get<MicroCMSListContent & TSchedule>({ endpoint, contentId });

/**
 * スケジュール詳細
 * @param param0
 * @returns
 */
const ScheduleDetail: React.FC<Props> = ({ contentId, closeParentModal }) => {
  const { data, error } = useSWR(['schedule', contentId], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { mutate } = useSWRConfig();
  const dispatch = useDispatch<AppDispatch>();

  function deleteSchedule(contentId: string) {
    return fetch(`https://calendar.microcms.io/api/v1/schedule/${contentId}`, {
      method: 'DELETE',
      headers: {
        'X-MICROCMS-API-KEY': process.env.API_KEY || ''
      }
    });
  }

  async function handleDeleteClick() {
    if (window.confirm('削除してもよいですか。')) {
      const res = await deleteSchedule(contentId);
      if (res.status === 202) {
        dispatch(
          addList({
            id: new Date().getTime(),
            text: `${data!.title}の予定を削除しました`,
            autoDelete: true,
            autoDeleteTime: 4000
          })
        );
        mutate('schedule');
        if (closeParentModal) {
          closeParentModal();
        }
      }
    }
  }

  if (error) {
    return <p>エラー</p>;
  }
  if (data) {
    const date = new Date(data.date);
    return (
      <div>
        <Button>編集</Button>
        <Button onClick={handleDeleteClick}>削除</Button>
        <p>{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}</p>
        <p>{data.title}</p>
        {data.place && <p>{data.place}</p>}
        {data.description && <p>{data.description}</p>}
      </div>
    );
  }
  return <p>読込中</p>;
};

export default ScheduleDetail;
