import React from "react";
import styled from "styled-components";

const Divider = () => {
  return <StyledDivider />;
};

const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(25, 27, 31, 0.08);
`;

export default Divider;
