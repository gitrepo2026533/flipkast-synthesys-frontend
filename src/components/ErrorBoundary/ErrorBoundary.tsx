import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import * as Sentry from "@sentry/react";

import { SentryErrors } from "../../lib/sentry";
import Navigation from "../Navigation/Navigation";
import { LogoIcon } from "../Icons/LogoIcon";
import Button from "../Button/Button";

class ErrorBoundary extends React.PureComponent {
  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, info: any) {
    Sentry.captureException(new Error(SentryErrors.PAGE_CRASH.title), {
      tags: SentryErrors.PAGE_CRASH.tags,
      extra: {
        details: error,
      },
    });
    this.setState({ hasError: true });
  }

  render() {
    const children = (this.props as any).children;

    if (this.state.hasError) {
      return <ErrorCase />;
    } else {
      return children;
    }
  }
}

const ErrorCase = () => {
  return (
    <Container>
      <Navigation
        withThemeSwitcher={false}
        startAdornment={
          <Link to="/">
            <LogoIcon />
          </Link>
        }
      >
        {" "}
      </Navigation>
      <ErrorText>Something wrong happened on our side. Please reach out to support with code 9999</ErrorText>
      <ButtonWrapper>
        <Button text="Go Home" onClick={() => (document.location.href = "/")} />
      </ButtonWrapper>
    </Container>
  );
};

const ErrorText = styled.div`
  font-size: 20px;
  text-align: center;
  margin: 20px auto;
  max-width: 90%;
`;

const ButtonWrapper = styled.div`
  max-width: 300px;
  margin: 20px auto;
`;

const Container = styled.div`
  width: 1600px;
  max-width: 90%;
  margin: 0 auto;
`;

export default ErrorBoundary;
