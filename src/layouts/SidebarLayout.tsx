import React, { ReactNode } from "react";
import styled from "styled-components";

import Navigation from "../components/Navigation/Navigation";
import Sidebar from "../components/Sidebar/Sidebar";

interface Props {
  children: ReactNode;
}

const SidebarLayout = ({ children }: Props) => (
  <Wrapper>
    <Navigation />
    <Content>
      <Sidebar />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Content>
  </Wrapper>
);

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  padding: 26px 40px 28px;
  row-gap: 26px;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1001px) {
    padding: 24px 16px 32px;
  }
`;

const Content = styled("div")`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  gap: 28px;
  border-radius: 16px;
  flex: 1;
`;

const ChildrenWrapper = styled("div")`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export default SidebarLayout;
