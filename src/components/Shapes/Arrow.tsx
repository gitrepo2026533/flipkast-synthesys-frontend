import React from "react";
import styled from "styled-components";

interface Props {
  background: string;
}

export const Arrow = ({ background }: Props) => <StyledDiv background={background} />;

const StyledDiv = styled.div<{ background: string }>`
  width: 100%;
  height: 100%;
  clip-path: polygon(100% 50%, 82% 100%, 77% 97%, 93% 55%, 0 54%, 0 46%, 93% 46%, 77% 3%, 82% 0);
  background: ${({ background }) => background};
`;
