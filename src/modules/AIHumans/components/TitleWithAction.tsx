import React, { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  title: string;
  type?: string;
  action?: ReactNode;
  children: ReactNode | ReactNode[];
}

const TitleWithAction = ({ title, type, action, children }: Props) => {
  return (
    <>
      <Wrapper type={type}>
        <Title>{title}</Title>
        {action}
      </Wrapper>
      {children}
    </>
  );
};

const Wrapper = styled.div<{ type?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  ${({ type }) =>
    type === "text" &&
    `
      button {
        svg > path {
          fill: #FF6C76;
        }

        span {
          color: #FF6C76;
          background: none;
          -webkit-background-clip: unset;
          -webkit-text-fill-color: unset;
        }
      }
    `};

  ${({ type }) =>
    type === "humatar" &&
    `
      justify-content: initial;

      & > span {
        margin-right: 10px;
      }

      button:last-of-type {
        margin-left: auto;
        flex-direction: row-reverse;
        gap: 4px;

        button {
          width: 20px;
          height: 20px;

          svg {
            width: 7px;
            height: 7px;
          }
        }
      }
    `}
`;

const Title = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.primaryText};
`;

export default TitleWithAction;
