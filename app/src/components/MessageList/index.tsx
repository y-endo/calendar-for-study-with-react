import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/stores';
import { AppDispatch } from '~/stores';
import { deleteList } from '~/stores/message';

type Props = {
  data: {
    id: number;
    text: string;
    autoDelete?: boolean;
    autoDeleteTime?: number;
  };
};
const Message: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (data.autoDelete && data.autoDeleteTime) {
      setTimeout(() => {
        dispatch(deleteList(data.id));
      }, data.autoDeleteTime);
    }
  }, []);

  function handleClick(event: React.MouseEvent): void {
    const id = event.currentTarget.getAttribute('id')?.replace('message-item', '');
    if (id) {
      dispatch(deleteList(parseInt(id, 10)));
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
