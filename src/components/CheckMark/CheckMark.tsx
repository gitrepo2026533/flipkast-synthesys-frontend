import React from "react";
import styled from "styled-components";

interface Props {
  title: string;
  active?: boolean;
  handleClick: () => void;
}

const CheckMark = ({ title, active, handleClick }: Props) => (
  <Wrapper active={active} onClick={handleClick}>
    <Title>{title}</Title>
  </Wrapper>
);

const Wrapper = styled.div<{ active?: boolean }>`
  height: 48px;
  min-width: 130px;
  padding-left: 15px;
  padding-right: 15px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.buttonShadow};
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${({ active, theme }) =>
    active &&
    `
    border: 1px solid ${theme.activeMenu};
    background: ${theme.button};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    `}
`;

const Title = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.primaryText}99;
`;

export default CheckMark;
