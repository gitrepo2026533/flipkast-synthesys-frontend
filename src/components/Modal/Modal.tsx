import React, { ReactNode } from "react";
import styled from "styled-components";
import { ModalCloseIcon } from "../Icons/ModalCloseIcon";

interface ModalProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
  open: boolean;
  onClose: () => void;
  closeIcon?: boolean;
  children?: ReactNode;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

const Modal = ({
  title,
  description,
  open,
  onClose,
  closeIcon = true,
  children,
  maxWidth = 704,
  maxHeight = 456,
  className,
}: ModalProps) => {
  return (
    <>
      <Wrapper open={open} maxWidth={maxWidth} maxHeight={maxHeight}>
        <Content className={className}>
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
          {closeIcon && (
            <CloseIconWrapper onClick={onClose}>
              <ModalCloseIcon />
            </CloseIconWrapper>
          )}
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Content>
      </Wrapper>
      {open && <Darkener onClick={onClose} />}
    </>
  );
};

const Wrapper = styled.div<{ open: boolean; maxWidth?: number; maxHeight?: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth}px;
  max-height: ${({ maxHeight }) => maxHeight}px;
  height: 100%;
  margin: auto;
  z-index: 101;
  display: none;
  align-items: center;
  justify-content: center;

  ${({ open }) =>
    open &&
    `
        display: flex;
    `}

  .character, .human {
    height: 100%;
    overflow: hidden;
    max-height: 95vh;

    & > div {
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: row;
    }
  }

  .character {
    padding-left: 0;

    @media (max-width: 756px) {
      padding-left: 24px;
    }
  }

  .create-new-project {
    max-height: 95vh;

    @media (max-width: 500px) {
      & > div:last-of-type {
        overflow: hidden auto;
        margin-top: 16px;
      }
    }
  }
`;

const Content = styled.div`
  position: absolute;
  margin: auto;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.thirdCardShadow};
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  padding: 40px;

  @media (max-width: 735px), (max-height: 800px), (max-width: 949px) and (max-height: 500px) {
    padding: 24px;
  }
  @media (max-width: 949px) and (max-height: 860px) {
    padding: 24px;
  }
  @media (max-width: 949px) and (max-height: 660px) {
    padding: 15px;
  }
  @media (max-width: 756px) {
    width: 90%;
  }
`;

const ChildrenWrapper = styled.div`
  @media (max-width: 949px), (max-height: 850px) {
    margin-top: 0;
  }
`;

const Title = styled.span`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: ${({ theme }) => theme.primaryText};
`;

const Description = styled.span`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.6;
  margin-top: 16px;

  & > span {
    font-weight: 600;
  }
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 26px;
  right: 26px;
  cursor: pointer;
`;

const Darkener = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(25, 27, 31, 0.76);
  backdrop-filter: blur(6px);
`;

export default Modal;
