import React from "react";
import styled from "styled-components";

interface Props {
  background: string;
}

export const Star = ({ background }: Props) => <StyledDiv background={background} />;

const StyledDiv = styled.div<{ background: string }>`
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 61% 35%, 100% 35%, 68% 57%, 79% 100%, 50% 70%, 21% 100%, 32% 57%, 0% 35%, 39% 35%);
  background: ${({ background }) => background};
`;
