import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '~/stores';
import { AppDispatch } from '~/stores';
import { deleteMessage } from '~/stores/message';

/**
 * Props
 * data.id: メッセージ管理ID
 * data.text: メッセージテキスト
 * data.autoDelete: 自動非表示フラグ
 * data.autoDeleteTime: 自動表示するまでの時間（ms）
 */
type Props = {
  data: {
    id: number;
    text: string;
    autoDelete?: boolean;
    autoDeleteTime?: number;
  };
};

/**
 * 全画面共通のメッセージリスト
 * 右下に固定表示される。
 */
const Message: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    // 自動削除
    if (data.autoDelete && data.autoDeleteTime) {
      setTimeout(() => {
        dispatch(deleteMessage(data.id));
      }, data.autoDeleteTime);
    }
  }, []);

  /**
   * メッセージ本体のクリックイベントハンドラ
   * @param event
   */
  function handleClick(event: React.MouseEvent): void {
    // クリックしたメッセージを削除
    const id = event.currentTarget.getAttribute('id')?.replace('message-item', '');
    if (id) {
      dispatch(deleteMessage(parseInt(id, 10)));
    }
  }

  return (
    <StyledMessage id={`message-item${data.id}`} key={`item-${data.id}`} onClick={handleClick}>
      {data.text}
    </StyledMessage>
  );
};

const MessageList: React.FC = () => {
  const list = useSelector((state: RootState) => state.message.list);
  const view = list.map(item => <Message key={`item-${item.id}`} data={item} />);

  if (list.length === 0) return null;

  return <StyledMessageList>{view}</StyledMessageList>;
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

const StyledMessageList = styled.ul`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10;
`;
const StyledMessage = styled.li`
  min-width: 150px;
  padding: 12px 10px;
  margin-top: 10px;
  background: ${rgba('#333', 0.7)};
  color: #fff;
  cursor: pointer;
`;

export default MessageList;
