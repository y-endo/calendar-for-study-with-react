import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import useSWR from 'swr';
import { MicroCMSListResponse } from 'microcms-js-sdk';

import TSchedule from '~/types/Schedule';

import DefaultLayout from '~/components/layouts/Default';
import ScheduleList from '~/components/ScheduleList';

import microCMSClient from '~/utils/microCMSClient';

/**
 * スケジュールデータを取得する
 * @param endpoint
 */
const scheduleFetcher = (endpoint: string) =>
  microCMSClient.get<MicroCMSListResponse<TSchedule>>({
    endpoint,
    queries: {
      orders: 'date',
      limit: 50
    }
  });

const ScheduleListPage: NextPage = () => {
  const { data: schedule, error: scheduleError } = useSWR('schedule', scheduleFetcher, {
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
      <Head>スケジュール一覧</Head>
      <ScheduleList data={scheduleList} />
    </DefaultLayout>
  );
};

export default ScheduleListPage;
