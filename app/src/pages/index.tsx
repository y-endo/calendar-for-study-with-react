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
    revalidateIfStale: false, // 古いデータがある場合に自動再検証
    revalidateOnFocus: false, // ウィンドウがフォーカスされたときに自動的に再検証
    revalidateOnReconnect: false // ブラウザがネットワーク接続を回復すると自動的に再検証
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
