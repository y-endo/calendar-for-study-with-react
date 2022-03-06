import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';

type Props = {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<Props> = ({ isShow, setIsShow, children }) => {
  if (isShow) {
    return (
      <StyledModal onClick={() => setIsShow(false)}>
        <StyledModalInner onClick={event => event.stopPropagation()}>{children}</StyledModalInner>
      </StyledModal>
    );
  } else {
    return null;
  }
};

const StyledModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background: ${rgba('#000', 0.7)};
  width: 100%;
  height: 100%;
`;

const StyledModalInner = styled.div`
  width: 1000px;
  padding: 20px;
  background: #fff;
`;

export default Modal;
