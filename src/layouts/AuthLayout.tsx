import React, { FC, ReactNode } from "react";
import styled from "styled-components";
import { leftSignIn, rightSignIn } from "../mocks/signin";
import SignInCard from "../modules/SignIn/components/SignInCard";

interface IFormProps {
  children: ReactNode;
  variant?: "default" | "without-images";
}

const AuthLayout: FC<IFormProps> = ({ children, variant = "default" }) => {
  return (
    <Wrapper>
      <AuthWrapper>
        {children}
        {variant === "default" && (
          <AuthImageWrapper>
            <SignInCardWrapper variant="left">
              {leftSignIn.map((card) => (
                <SignInCard key={card.id} {...card} />
              ))}
            </SignInCardWrapper>
            <SignInCardWrapper variant="right">
              {rightSignIn.map((card) => (
                <SignInCard key={card.id} {...card} />
              ))}
            </SignInCardWrapper>
          </AuthImageWrapper>
        )}
      </AuthWrapper>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const AuthWrapper = styled("div")`
  max-width: 1318px;
  margin-left: auto;
  margin-right: auto;
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 45.5px;

  @media (max-width: 1201px) {
    gap: 0;
  }
`;

const AuthImageWrapper = styled("div")`
  display: flex;
  gap: 24px;
  width: 615px;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;

  ::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 615px;
    height: 115px;
    pointer-events: none;
    z-index: 5;
    background: ${({ theme }) => theme.authBackgroundBefore};
  }

  ::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 615px;
    height: 128px;
    z-index: 5;
    pointer-events: none;
    background: ${({ theme }) => theme.authBackgroundAfter};
    transform: matrix(1, 0, 0, -1, 0, 0);
  }

  @media (max-width: 1001px) {
    display: none;
  }
`;

const SignInCardWrapper = styled.div<{ variant?: "right" | "left" }>`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${({ variant }) =>
    variant === "left" &&
    `
    animation: leftCards 120s infinite;

  `}

  ${({ variant }) =>
    variant === "right" &&
    `
    animation: rightCards 120s infinite;
    `}
  
  @keyframes leftCards {
    0% {
      transform: translateY(-230%);
    }
    50% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(-230%);
    }
  }

  @keyframes rightCards {
    0% {
      transform: translateY(0%);
    }
    50% {
      transform: translateY(-230%);
    }
    100% {
      transform: translateY(0%);
    }
  }
`;

export default AuthLayout;
