import React from "react";
import styled from "styled-components";

interface Props {
  background: string;
}

export const Polygon = ({ background }: Props) => <StyledDiv background={background} />;

const StyledDiv = styled.div<{ background: string }>`
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 100%, 100% 70%, 100% 30%, 50% 0%, 0% 30%, 0% 70%);
  background: ${({ background }) => background};
`;
