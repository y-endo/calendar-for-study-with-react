import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';
import type { TToday } from '~/pages/api/today';

/**
 * 今日の日付を取得する
 * @param endpoint
 * @returns
 */
const fetcher = (endpoint: string): Promise<TToday> => fetch(endpoint).then(res => res.json());

const Home: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api/today', fetcher);

  React.useEffect(() => {
    let redirectURL = '';
    if (error) {
      const today = new Date();
      redirectURL = `/calendar/${today.getFullYear()}/${today.getMonth() + 1}`;
    }
    if (data) {
      redirectURL = `/calendar/${data.year}/${data.month}`;
    }

    if (redirectURL !== '') {
      router.replace(redirectURL);
    }
  }, [router, data, error]);

  return (
    <>
      <Head>カレンダー</Head>
    </>
  );
};

export default Home;
