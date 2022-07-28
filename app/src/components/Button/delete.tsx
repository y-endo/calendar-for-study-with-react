import React from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import Flex from '~/components/Flex';

import { AppDispatch } from '~/stores';
import { addMessage } from '~/stores/message';

import { scheduleFetcher } from '~/utils/fetcher';
import { deleteSchedule } from '~/utils/microCMS';

/**
 * Props
 * contentId: microCMS登録データのID
 * submitCallback: 削除submitのコールバック関数
 */
type Props = {
  contentId: string;
  submitCallback?: (isSuccess: boolean) => void;
};

/**
 * 予定削除ボタン
 */
const DeleteButton: React.FC<Props> = ({ contentId, submitCallback }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { data, error } = useSWR(['schedule', contentId], scheduleFetcher, {
    revalidateIfStale: false, // 古いデータがある場合に自動再検証
    revalidateOnFocus: false, // ウィンドウがフォーカスされたときに自動的に再検証
    revalidateOnReconnect: false // ブラウザがネットワーク接続を回復すると自動的に再検証
  });
  const dispatch = useDispatch<AppDispatch>();

  /**
   * クリックイベントハンドラ
   */
  async function handleDeleteClick() {
    if (isProcessing) return;
    setIsProcessing(true);

    if (error) {
      alert('エラー 該当するデータの取得に失敗');
      setIsProcessing(false);
    }
    if (data && window.confirm('削除してもよいですか。')) {
      let isSuccess = false;
      // 削除実行
      const res = await deleteSchedule(contentId);
      // 削除成功
      if (res.status === 202) {
        dispatch(
          addMessage({
            id: new Date().getTime(),
            text: `${data!.title}の予定を削除しました`,
            autoDelete: true,
            autoDeleteTime: 4000
          })
        );
        isSuccess = true;
      }
      setIsProcessing(false);

      if (submitCallback) {
        submitCallback(isSuccess);
      }
    } else {
      setIsProcessing(false);
    }
  }

  return (
    <Flex as="button" type="button" alignItems="center" justifyContent="center" onClick={handleDeleteClick}>
      <Image src="/img/icon-delete.svg" width={30} height={30} alt="" />
    </Flex>
  );
};

export default DeleteButton;
