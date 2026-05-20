import React, { useEffect } from "react";
import styled from "styled-components";

interface MenuPosition {
  y: "top" | "bottom";
  x: "left" | "right";
}

interface Props {
  open: boolean;
  position?: MenuPosition;
  children?: React.ReactNode;
  trigger: React.ReactNode;
  handleClose: () => void;
}

const ActionMenu = ({ children, trigger, open, position = { x: "left", y: "bottom" }, handleClose }: Props) => {
  return (
    <Wrapper>
      {trigger}
      {open && <MenuWrapper position={position}>{children}</MenuWrapper>}
      {open && <ClosePanel onClick={handleClose} />}
    </Wrapper>
  );
};

const Wrapper = styled.span``;

interface WrapperProps {
  position: MenuPosition;
}

const MenuWrapper = styled.div`
  padding: 12px;
  background: #f0f0f3;
  border-radius: 12px;
  border: 1px solid #0063b4;
  position: absolute;
  ${(props: WrapperProps) => (props.position.y === "top" ? "bottom: 50px" : "top: 50px")};
  ${(props: WrapperProps) => (props.position.x === "left" ? "right: 25px" : "left: 140px")};
  z-index: 25;

  @media (max-width: 516px) {
    ${(props: WrapperProps) => (props.position.y === "top" ? "bottom: 50px" : "top: 50px")};
    ${(props: WrapperProps) => (props.position.x === "left" ? "right: 25px" : "left: 100px")};
  }
`;

const ClosePanel = styled.div`
  position: fixed;
  z-index: 24;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default ActionMenu;
