import React, { ReactElement } from "react";
import styled from "styled-components";

interface Props {
  children: ReactElement | ReactElement[];
  title: string;
}

const ApiAccessBox = ({ title, children }: Props) => (
  <Wrapper>
    <Title>{title}</Title>
    {children}
  </Wrapper>
);

const Wrapper = styled.div`
  padding: 40px;
  width: 100%;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 750px) {
    padding: 20px;
  }
`;

const Title = styled.span`
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.primaryText};
  margin-bottom: 4px;
`;

export default ApiAccessBox;
