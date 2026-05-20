import React from "react";
import styled from "styled-components";

interface Props {
  background: string;
}

export const Rectangle = ({ background }: Props) => <StyledDiv background={background} />;

const StyledDiv = styled.div<{ background: string }>`
  width: 100%;
  height: 100%;
  background: ${({ background }) => background};
`;
