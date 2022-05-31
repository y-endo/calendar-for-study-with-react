import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { MicroCMSListResponse } from 'microcms-js-sdk';

import TSchedule from '~/types/Schedule';

import DefaultLayout from '~/components/layouts/Default';
import CalendarMonth from '~/components/Calendar/month';

import microCMSClient from '~/utils/microCMSClient';

/**
 * スケジュールデータを取得する
 * @param endpoint
 */
const fetcher = (endpoint: string) => microCMSClient.get<MicroCMSListResponse<TSchedule>>({ endpoint });

/**
 * カレンダーページ
 */
const CalendarMonthPage: NextPage = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const { data, error } = useSWR('schedule', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  let scheduleContents: TSchedule[] = [];

  // urlが/calendar/yyyy/mm or m/ 形式じゃない場合リダイレクト
  React.useEffect(() => {
    if (year && month) {
      if (!(isNaN(Number(year)) || isNaN(Number(month)))) {
        // /yyyy/ が4桁じゃない or 1950 より小さい or 2100 より大きい
        if (year.length !== 4 || Number(year) <= 1950 || Number(year) >= 2100) {
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
        id: 'error',
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
      </StyledContainer>
    </DefaultLayout>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledContainer = styled.div`
  display: flex;
  align-items: stretch;
  position: relative;
  height: calc(100vh - 80px); // -80px = header
  padding: 0 20px;
`;

export default CalendarMonthPage;
