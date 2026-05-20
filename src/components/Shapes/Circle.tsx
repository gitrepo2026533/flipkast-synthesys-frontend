import React from "react";
import styled from "styled-components";

interface Props {
  background: string;
}

export const Circle = ({ background }: Props) => <StyledDiv background={background} />;

const StyledDiv = styled.div<{ background: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ background }) => background};
`;
