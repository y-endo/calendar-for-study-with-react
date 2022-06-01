import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { MicroCMSListResponse, MicroCMSQueries } from 'microcms-js-sdk';

import TSchedule from '~/types/Schedule';

import DefaultLayout from '~/components/layouts/Default';
import ScheduleList from '~/components/ScheduleList';

import microCMSClient from '~/utils/microCMSClient';

/**
 * スケジュールデータを取得する
 * @param endpoint
 */
const scheduleFetcher = (endpoint: string, queries: MicroCMSQueries) =>
  microCMSClient.get<MicroCMSListResponse<TSchedule>>({
    endpoint,
    queries
  });

const ScheduleListPage: NextPage = () => {
  const router = useRouter();
  const queries: MicroCMSQueries = {
    orders: 'date',
    limit: 50
  };
  if (router.query.q) {
    queries.q = String(router.query.q);
  }
  const { data: schedule, error: scheduleError } = useSWR(['schedule', queries], scheduleFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  let scheduleList: TSchedule[] = [];

  // microCMSからスケジュールデータ取得
  if (scheduleError) {
    scheduleList = [
      {
        id: 'error',
        date: '',
        title: '通信エラー'
      }
    ];
  }
  if (schedule) {
    scheduleList = schedule.contents;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>スケジュール一覧</title>
      </Head>
      <ScheduleList data={scheduleList} />
    </DefaultLayout>
  );
};

export default ScheduleListPage;
