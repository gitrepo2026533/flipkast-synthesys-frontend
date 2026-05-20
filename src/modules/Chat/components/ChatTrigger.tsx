import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import { ChatIcon } from "../../../components/Icons/ChatIcon";
import { Popups, updatePopup } from "../../../redux/actions/popupsActions";

const ChatTrigger = () => {
  const dispatch = useDispatch();

  const handleOpenChat = () => {
    dispatch(updatePopup({ popup: Popups.chatPopup, status: true }));
  };

  return (
    <Wrapper>
      <StyledIconButton onClick={handleOpenChat} iconButtonTheme={IconButtonThemes.Rounded} icon={<ChatIcon />} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  z-index: 99;
  bottom: 40px;
  right: 40px;
`;

const StyledIconButton = styled(IconButton)`
  width: 40px;
  min-width: 40px;
  height: 40px;
  box-shadow: -2px -2px 7px rgba(255, 255, 255, 0.3), 2px 2px 7px rgba(174, 174, 192, 0.3),
    inset -2px -2px 4px rgba(0, 0, 0, 0.1), inset 2px 2px 4px rgba(255, 255, 255, 0.5);

  @media (min-width: 1000px) {
    transform: scale(1.65);
  }
`;

export default ChatTrigger;
