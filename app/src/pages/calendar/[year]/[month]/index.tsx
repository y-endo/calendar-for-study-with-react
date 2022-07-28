import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';
import { MicroCMSQueries } from 'microcms-js-sdk';

import TSchedule from '~/types/Schedule';

import DefaultLayout from '~/components/layouts/Default';
import CalendarMonth from '~/components/Calendar/month';

import { RootState, AppDispatch } from '~/stores';
import { setMonthCalendarQueries } from '~/stores/microCMSQueries';

import { schedulesFetcher } from '~/utils/fetcher';

/**
 * カレンダーページ
 */
const CalendarMonthPage: NextPage = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const queries = useSelector((state: RootState) => state.microCMSQueries.monthCalendar);

  React.useEffect(() => {
    if (year && month) {
      // urlが/calendar/yyyy/mm or m/ 形式ではない場合リダイレクト
      if (!(isNaN(Number(year)) || isNaN(Number(month)))) {
        // /yyyy/ が4桁ではない or 1950 より小さい or 2100 より大きい
        if (year.length !== 4 || Number(year) <= 1950 || Number(year) >= 2100) {
          router.replace('/');
        }
        // /mm/ が2桁以上 or 1 より小さい or 12 より大きい
        if (month.length > 2 || parseInt(String(month), 10) < 1 || parseInt(String(month), 10) > 12) {
          router.replace('/');
        }

        // urlに問題がなければmicroCMSのqueryを設定
        // 取得するデータの範囲を今年と昨年末・来年始のデータに絞る
        let filters: MicroCMSQueries['filters'] = '';
        const intYear = parseInt(String(year), 10);
        filters += `startDate[greater_than]${intYear - 1}-12[and]startDate[less_than]${intYear + 1}-01`;

        const queries: MicroCMSQueries = {
          limit: 1000,
          filters
        };

        dispatch(setMonthCalendarQueries(queries));
      } else {
        router.replace('/');
      }
    }
  }, [router, year, month, dispatch]);

  const { data, error } = useSWR(['schedule', queries], schedulesFetcher, {
    revalidateIfStale: false, // 古いデータがある場合に自動再検証
    revalidateOnFocus: false, // ウィンドウがフォーカスされたときに自動的に再検証
    revalidateOnReconnect: false, // ブラウザがネットワーク接続を回復すると自動的に再検証
    revalidateOnMount: true // コンポーネントのマウント時に自動再検証
  });

  let scheduleContents: TSchedule[] = [];

  // 予定データの取得に失敗
  if (error) {
    scheduleContents = [
      {
        id: 'error',
        startDate: '',
        title: '通信エラー'
      }
    ];
  }
  // 予定データの取得
  if (data) {
    scheduleContents = data.contents;
  }

  // router.queryが未取得の場合はなにも描画しない
  if (!(year && month)) return null;

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
