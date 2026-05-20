import React, { ReactNode } from "react";
import styled from "styled-components";

import Navigation from "../components/Navigation/Navigation";

interface Props {
  children: ReactNode;
  navActions?: ReactNode;
  startAdornment?: ReactNode;
}

const DashboardLayout = ({ children, navActions, startAdornment }: Props) => (
  <Wrapper startAdornment>
    <Navigation startAdornment={startAdornment}>{navActions}</Navigation>
    <Content>{children}</Content>
  </Wrapper>
);

const Wrapper = styled("div")<{ startAdornment?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 24px 40px 32px;
  row-gap: 32px;
  flex: 1;
  overflow: hidden;

  ${({ startAdornment }) =>
    startAdornment &&
    `
      row-gap: 24px;
      height: 100%;
      padding: 24px 40px 15px 32px;
    `}

  @media (max-width: 1251px) {
    padding: 24px 16px 32px;
  }
`;

const Content = styled("div")`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

export default DashboardLayout;
