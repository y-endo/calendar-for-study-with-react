import React from 'react';
import styled from 'styled-components';
import useSWR, { useSWRConfig } from 'swr';
import { MicroCMSListContent } from 'microcms-js-sdk';
import TSchedule from '~/types/Schedule';
import microCMSClient from '~/utils/microCMSClient';
import { Button } from '~/components/common/Button';
import { addMessage } from '~/stores/message';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/stores';
import Link from 'next/link';

type Props = {
  contentId: string;
  closeParentModal?: Function;
};

/**
 * スケジュールデータ1件を取得する
 * @param endpoint
 * @param contentId
 * @returns
 */
const fetcher = (endpoint: string, contentId: string) => microCMSClient.get<MicroCMSListContent & TSchedule>({ endpoint, contentId });

/**
 * スケジュール詳細
 * @param param0
 * @returns
 */
const ScheduleDetail: React.FC<Props> = ({ contentId, closeParentModal }) => {
  const [isEditClick, setIsEditClick] = React.useState(false);
  const { data, error } = useSWR(['schedule', contentId], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { mutate } = useSWRConfig();
  const dispatch = useDispatch<AppDispatch>();

  function deleteSchedule(contentId: string) {
    return fetch(`https://calendar.microcms.io/api/v1/schedule/${contentId}`, {
      method: 'DELETE',
      headers: {
        'X-MICROCMS-API-KEY': process.env.API_KEY || ''
      }
    });
  }

  function handleEditClick() {
    setIsEditClick(true);
  }

  async function handleDeleteClick() {
    if (window.confirm('削除してもよいですか。')) {
      const res = await deleteSchedule(contentId);
      if (res.status === 202) {
        dispatch(
          addMessage({
            id: new Date().getTime(),
            text: `${data!.title}の予定を削除しました`,
            autoDelete: true,
            autoDeleteTime: 4000
          })
        );
        mutate('schedule');
        if (closeParentModal) {
          closeParentModal();
        }
      }
    }
  }

  if (error) {
    return <p>エラー</p>;
  }
  if (data) {
    const date = new Date(data.date);
    return (
      <StyledDetail>
        <StyledHeader>
          <Link href={`/schedule/${data.id}`} passHref>
            <Button as="a" onClick={handleEditClick}>
              編集
            </Button>
          </Link>
          <Button onClick={handleDeleteClick}>削除</Button>
        </StyledHeader>
        {data.isImportant && <StyledStrong>重要な予定</StyledStrong>}
        <StyledDl>
          <dt>タイトル</dt>
          <dd>{data.title}</dd>
        </StyledDl>
        <StyledDl>
          <dt>日時</dt>
          <dd>{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}</dd>
        </StyledDl>
        {data.place && (
          <StyledDl>
            <dt>場所</dt>
            <dd>{data.place}</dd>
          </StyledDl>
        )}
        {data.description && (
          <StyledDl>
            <dt>説明</dt>
            <dd>{data.description}</dd>
          </StyledDl>
        )}
        <StyledCover visible={isEditClick} />
      </StyledDetail>
    );
  }
  return <p>読込中</p>;
};

const StyledDetail = styled.div`
  position: relative;
  padding: 10px 0;
`;

const StyledHeader = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > a,
  button {
    margin-left: 10px;
  }
`;

const StyledStrong = styled.strong`
  display: inline-block;
  color: ${props => props.theme.palette.primary.dark};
  font-weight: bold;
  margin-bottom: 10px;
`;

const StyledDl = styled.dl`
  margin-bottom: 15px;
  dt {
    font-weight: bold;
  }
  dd {
    font-size: 1.8rem;
    margin-top: 3px;
  }
`;

const StyledCover = styled.div<{ visible?: boolean }>`
  display: ${props => (props.visible ? 'block' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

export default ScheduleDetail;
