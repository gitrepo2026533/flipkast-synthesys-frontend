import React from "react";
import styled from "styled-components";

interface Props {
  text?: string;
}

const Tooltip = ({ text }: Props) => {
  return (
    <Wrapper>
      <span>{text}</span>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 12px;
  background-color: ${({ theme }) => theme.primaryBackground};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.buttonShadow};
  opacity: 0;
  transition: opacity 0.3s;
  position: absolute;
  visibility: hidden;
  z-index: 10;
  width: auto;

  span {
    font-weight: 500;
    font-size: 14px !important;
    line-height: 20px !important;
    font-family: "Montserrat", sans-serif;
    color: ${({ theme }) => theme.primaryText} !important;
  }
`;

export default Tooltip;
