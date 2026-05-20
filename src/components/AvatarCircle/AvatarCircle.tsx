import React from "react";
import styled from "styled-components";

interface Props {
  image: string;
  width?: number;
  height?: number;
}

const AvatarCircle = ({ image, width, height }: Props) => (
  <Wrapper style={{ width: `${width || 160}px`, height: `${height || 160}px` }}>
    <img style={{ width: `${width || 160}px`, height: `${height || 160}px` }} src={image} alt="" />
  </Wrapper>
);

const Wrapper = styled.div`
  position: relative;
  background: #c5c5c5;
  border-radius: 50%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
  }
`;

export default AvatarCircle;
