import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { MicroCMSListResponse } from 'microcms-js-sdk';
import styled from 'styled-components';
import TSchedule from '~/types/Schedule';
import Head from 'next/head';
import DefaultLayout from '~/components/layouts/Default';
import CalendarMonth from '~/components/Calendar/month';
import ScheduleList from '~/components/ScheduleList';
import microCMSClient from '~/utils/microCMSClient';

const fetcher = (endpoint: string) => microCMSClient.get<MicroCMSListResponse<TSchedule>>({ endpoint });

const Month: NextPage = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const { data, error } = useSWR('schedule', fetcher);
  let scheduleContents: TSchedule[] = [];

  // urlが/calendar/yyyy/mm or m/ 形式じゃない場合リダイレクト
  React.useEffect(() => {
    if (year && month) {
      if (!(isNaN(Number(year)) || isNaN(Number(month)))) {
        if (year.length !== 4) {
          router.replace('/');
        }
        if (month.length > 2 || parseInt(String(month), 10) > 12) {
          router.replace('/');
        }
      } else {
        router.replace('/');
      }
    }
  }, [router, year, month]);

  // microCMSからスケジュールデータ取得
  if (error) {
    scheduleContents = [
      {
        date: '',
        title: '通信エラー'
      }
    ];
  }
  if (data) {
    scheduleContents = data.contents;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>カレンダー</title>
      </Head>
      <StyledContainer>
        <CalendarMonth year={parseInt(year as string, 10)} month={parseInt(month as string, 10)} schedule={scheduleContents} />
        <ScheduleList data={scheduleContents} />
      </StyledContainer>
    </DefaultLayout>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: stretch;
`;

export default Month;