import React from "react";
import styled from "styled-components";

interface Props {
  background: string;
}

export const Heart = ({ background }: Props) => (
  <>
    <StyledSvg width="0" height="0">
      <defs>
        <clipPath id="mask1" clipPathUnits="objectBoundingBox">
          <path
            id="curve"
            transform="scale(0.011, 0.0123)"
            d="M45.479,17.482C33.7-10.258.22-3.785,0,28.411-0.123,46.094,15.942,52.7,26.638,59.773,37.01,66.628,44.392,76.007,45.549,80c0.99-3.912,9.212-13.555,18.813-20.418C74.86,52.077,91.123,45.9,91,28.219,90.779-4.057,56.716-9.151,45.479,17.482Z"
          ></path>
        </clipPath>
      </defs>
    </StyledSvg>
    <StyledDiv background={background} />
  </>
);

const StyledSvg = styled.svg`
  position: absolute;
`;

const StyledDiv = styled.div<{ background: string }>`
  width: 100%;
  height: 100%;
  clip-path: url(#mask1);
  background: ${({ background }) => background};
`;
