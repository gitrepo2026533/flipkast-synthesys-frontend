import React from "react";
import styled from "styled-components";

import Sidebar from "../../components/Sidebar/Sidebar";
import SidebarLayout from "../../layouts/SidebarLayout";
import withPrivateRoute from "../../hocs/withPrivateRoute";
import SecreteKeyGeneration from "./components/SecreteKeyGeneration";
import ApiAccessInformationBox from "./components/ApiAccessInformation";

const ApiAccessPage = () => {
  return (
    <Wrapper>
      <SidebarLayout>
        <Content>
          <MobileOnly>
            <Title>Voice only</Title>
          </MobileOnly>
          <div style={{ width: "100%" }}>
            <MobileOnly>
              <Sidebar mobile />
            </MobileOnly>
            <DesktopOnly>
              <Title>Voice only</Title>
            </DesktopOnly>
          </div>
          <ApiAccessContentWrapper>
            <SecreteKeyGeneration />
            <div style={{ maxWidth: "462px" }}>
              <ApiAccessInformationBox />
            </div>
          </ApiAccessContentWrapper>
        </Content>
      </SidebarLayout>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;

  .container {
    max-width: 1200px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  overflow: hidden auto;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1001px) {
    display: flex;

    & > div {
      display: flex;
    }
  }
`;

const DesktopOnly = styled.div`
  flex: 1;

  @media (max-width: 1001px) {
    display: none;
  }
`;

const Title = styled("h1")`
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.primaryText};
  flex: 1;
`;

const ApiAccessContentWrapper = styled.div`
  display: flex;
  align-items: start;
  gap: 16px;

  & > div {
    flex: 1;
  }

  @media (max-width: 1001px) {
    flex-direction: column;

    & > div {
      max-width: 100% !important;
    }
  }
`;

export default withPrivateRoute(ApiAccessPage);
