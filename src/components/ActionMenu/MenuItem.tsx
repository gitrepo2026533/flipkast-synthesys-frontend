import React from "react";
import styled from "styled-components";

interface Props {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const MenuItem = ({ icon, children, onClick }: Props) => {
  return (
    <Wrapper onClick={onClick}>
      {icon}
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  column-gap: 8px;
  align-items: center;
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;

  & svg {
    width: 16px;
    height: 16px;
  }

  & path {
    fill: #0063b4;
  }
`;

export default MenuItem;
