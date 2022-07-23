import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';
import { MicroCMSListResponse, MicroCMSQueries } from 'microcms-js-sdk';

import TSchedule from '~/types/Schedule';

import DefaultLayout from '~/components/layouts/Default';
import ScheduleList from '~/components/ScheduleList';
import Button from '~/components/Button';

import { RootState, AppDispatch } from '~/stores';
import { setScheduleListQueries } from '~/stores/microCMSQueries';

import { microCMSClient } from '~/utils/microCMS';
import { schedulesFetcher } from '~/utils/fetcher';

const ScheduleListPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const queries = useSelector((state: RootState) => state.microCMSQueries.scheduleList);
  let currentPage = 1;

  if (router.query.p && !isNaN(Number(router.query.p))) {
    currentPage = parseInt(String(router.query.p), 10);
  }

  React.useEffect(() => {
    // microCMSのGETクエリ
    const queries: MicroCMSQueries = {
      orders: 'startDate',
      limit: 20
    };

    // 何件目から取得するか
    if (router.query.p && !isNaN(Number(router.query.p))) {
      queries.offset = (currentPage - 1) * queries.limit!;
    }

    // GETパラメータ「q」から検索するキーワードを取得
    if (router.query.q) {
      queries.q = String(router.query.q);
    }

    dispatch(setScheduleListQueries(queries));
  }, [router, dispatch, currentPage]);

  const { data: schedule, error: scheduleError } = useSWR(['schedule', queries], schedulesFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  let scheduleList: TSchedule[] = [];

  // 予定データの取得に失敗
  if (scheduleError) {
    scheduleList = [
      {
        id: 'error',
        startDate: '',
        title: '通信エラー'
      }
    ];
  }
  // 予定データの取得
  if (schedule) {
    scheduleList = schedule.contents;
  }

  let view;
  let hasPagination = false;
  let isFirstPage = currentPage === 1;
  let isLastPage = false;
  if (schedule) {
    if (schedule.totalCount === 0) {
      view = <p>検索結果がありません。</p>;
    } else {
      view = <ScheduleList data={scheduleList} />;
      hasPagination = true;
      isLastPage = schedule.totalCount < queries.limit! * currentPage;
    }
  } else {
    view = <p>読込中</p>;
  }

  let paginationLink = `${router.pathname}?`;
  if (router.query.q) {
    paginationLink += `q=${router.query.q}&`;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>予定一覧</title>
      </Head>
      <div>
        {view}
        {hasPagination && (
          <StyledPagination>
            {!isFirstPage && (
              <Link href={`${paginationLink}p=${currentPage - 1}`} passHref>
                <Button as="a">前のページ</Button>
              </Link>
            )}
            {!isLastPage && (
              <Link href={`${paginationLink}p=${currentPage + 1}`} passHref>
                <Button as="a">次のページ</Button>
              </Link>
            )}
          </StyledPagination>
        )}
      </div>
    </DefaultLayout>
  );
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;

  ${Button} {
    margin: 0 20px;
  }
`;

export default ScheduleListPage;
