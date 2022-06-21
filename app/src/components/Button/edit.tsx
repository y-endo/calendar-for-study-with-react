import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Flex from '~/components/Flex';

/**
 * Props
 * contentId: microCMS登録データのID
 * submitCallback: 削除submitのコールバック関数
 */
type Props = {
  contentId: string;
};

/**
 * 予定編集ボタン
 */
const EditButton: React.FC<Props> = ({ contentId }) => {
  return (
    <Link href={`/schedule/${contentId}`} passHref>
      <Flex as="a" alignItems="center" justifyContent="center">
        <Image src="/img/icon-edit.svg" width={30} height={30} alt="" />
      </Flex>
    </Link>
  );
};

export default EditButton;
