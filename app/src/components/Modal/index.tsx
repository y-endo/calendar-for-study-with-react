import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * モーダル
 * @param param0
 * @returns
 */
const Modal: React.FC<Props> = ({ isOpen, setIsOpen, children }) => {
  if (isOpen) {
    return (
      <StyledModal onClick={() => setIsOpen(false)}>
        <StyledModalInner onClick={event => event.stopPropagation()}>
          {React.cloneElement(children as React.ReactElement, {
            closeParentModal: () => {
              setIsOpen(false);
            }
          })}
          <StyledCloseButton onClick={() => setIsOpen(false)} />
        </StyledModalInner>
      </StyledModal>
    );
  } else {
    return null;
  }
};

//-----------------------------------------------------
// Styled
//-----------------------------------------------------

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
  position: relative;
  width: 1000px;
  padding: 50px 20px;
  background: #fff;
`;

const StyledCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  width: 30px;
  height: 30px;
  background: url('/img/icon-close.svg') no-repeat center center;
  background-size: cover;
`;

export default Modal;
