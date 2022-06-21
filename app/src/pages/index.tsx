import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';

import { nowFetcher } from '~/utils/fetcher';

/**
 * トップページ
 * トップページは存在せず、カレンダーページにリダイレクトする
 */
const Home: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api/now', nowFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  React.useEffect(() => {
    let redirectURL = '';
    if (error) {
      const now = new Date();
      redirectURL = `/calendar/${now.getFullYear()}/${now.getMonth() + 1}`;
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
