import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AvatarCircle from "../../../components/AvatarCircle/AvatarCircle";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import { CloseIconV3, SendIcon } from "../../../components/Icons/Icons";
import Textfield, { TextfieldVariant } from "../../../components/Textfield/Textfield";
import { refreshMessage, removeLastFromHistory, sendMessageServer } from "../../../redux/actions/chatActions";
import { Popups, updatePopup } from "../../../redux/actions/popupsActions";
import { getIsLastMessageLoading, getMessagesHistory } from "../../../redux/reducers/chatReducer";
import { getChatPopupIsOpen } from "../../../redux/reducers/popupsReducer";
import { MessagesHistory } from "../../../types/chat";
import Message, { MessageSender } from "./Message";

const ChatPopup = () => {
  const [messageText, setMessageText] = useState("");

  const isOpen = useSelector(getChatPopupIsOpen);
  const messagesHistory = useSelector(getMessagesHistory);
  const isLastMessageLoading = useSelector(getIsLastMessageLoading);

  const dispatch = useDispatch();

  const handleChatClose = () => {
    dispatch(updatePopup({ popup: Popups.chatPopup, status: false }));
  };

  const handleMessageTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleMessageSend = () => {
    if (!messageText) return;
    dispatch(sendMessageServer({ text: messageText, history: messagesHistory }));
    setMessageText("");
  };

  const handleEnterClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!messageText || isLastMessageLoading) return;
      dispatch(sendMessageServer({ text: messageText, history: messagesHistory }));
      setMessageText("");
    }
  };

  const handleRefresh = () => {
    const prevUserMessage = (messagesHistory as any).findLast((message: MessagesHistory) => message.is_sent);
    if (!prevUserMessage) return;
    const message = prevUserMessage.message;
    dispatch(refreshMessage({ history: messagesHistory, lastUserMessage: message }));
  };

  if (!isOpen) return <span />;

  return (
    <>
      <Wrapper>
        <Top>
          <ChatInfoWrapper>
            <AssistantAvatarWrapper>
              <AvatarCircle image="/images/SynthesysAssistant.svg" width={36} height={36} />
            </AssistantAvatarWrapper>
            <ChatNameWrapper>
              <ChatName>Synthesys AI Writer</ChatName>
              <ChatDescription>Your writing partner in crime</ChatDescription>
            </ChatNameWrapper>
          </ChatInfoWrapper>
          <CloseWrapper>
            <IconButton
              onClick={handleChatClose}
              iconButtonTheme={IconButtonThemes.Transparent}
              icon={<CloseIconV3 />}
            />
          </CloseWrapper>
        </Top>
        <MessagesWrapper>
          <Message
            showActions={false}
            sender={MessageSender.bot}
            text="Hi there, I’m Synthesys AI Writer. I am here to help you."
          />
          {messagesHistory.map((item, index) => (
            <Message
              key={item.message}
              sender={item.is_sent ? MessageSender.user : MessageSender.bot}
              text={item.message}
              images={item.image_urls}
              handleRefresh={handleRefresh}
              isLast={index === messagesHistory.length - 1}
            />
          ))}
          {isLastMessageLoading && <Message sender={MessageSender.bot} text={""} isLoading={true} />}
        </MessagesWrapper>
        <Actions>
          <TextfieldWrapper>
            <Textfield
              onKeyPress={handleEnterClick}
              variant={TextfieldVariant.endAdornment}
              placeholder="Type your request here"
              endAdornment={
                <IconButton
                  disabled={isLastMessageLoading}
                  onClick={handleMessageSend}
                  icon={<SendIcon />}
                  iconButtonTheme={IconButtonThemes.Transparent}
                />
              }
              onChange={handleMessageTextChange}
              value={messageText}
            />
          </TextfieldWrapper>
          <IconButton
            disabled={isLastMessageLoading}
            onClick={handleMessageSend}
            icon={<SendIcon />}
            iconButtonTheme={IconButtonThemes.Transparent}
          />
        </Actions>
      </Wrapper>
      <Panel onClick={handleChatClose} />
    </>
  );
};

const Wrapper = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  width: 550px;
  height: 650px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.chatBackground};
  box-shadow: ${({ theme }) => theme.chatShadow};
  border-radius: 16px;

  @media (max-width: 1500px) {
    width: 450px;
    height: 500px;
    max-height: 80vh;
  }

  @media (max-width: 900px) {
    width: 450px;
    bottom: 20px;
    right: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
    bottom: 0;
    right: 0;
    border-radius: 16px 16px 0 0;
  }
`;

const Top = styled.div`
  padding: 15px 26px 15px 32px;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.chatHeaderBackground};
  box-shadow: 0px 36px 134px rgba(37, 34, 40, 0.07), 0px 4.50776px 16.7789px rgba(37, 34, 40, 0.035);
  border-radius: 16px 16px 0 0;

  @media (max-width: 900px) {
    padding: 15px 20px 14px 26px;
  }
`;

const ChatInfoWrapper = styled.div`
  display: flex;
  flex: 1;
  column-gap: 12px;
  align-items: center;
`;

const CloseWrapper = styled.div`
  & svg {
    fill: ${({ theme }) => theme.closeChatIcon};
  }
`;

const AssistantAvatarWrapper = styled.div`
  & > div {
    background: #414155;
  }
`;

const ChatNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2px;
`;

const ChatName = styled.span`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.chatText};
`;

const ChatDescription = styled.span`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #9e9eae;
`;

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 24px;
  padding: 39px 16px 0 32px;
  overflow-y: auto;

  & > :first-child {
    margin-top: auto !important;
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.activeMenu};
  }

  ::-webkit-scrollbar-track {
    margin: 15px 0;
  }

  @media (max-width: 900px) {
    padding: 15px 18px 0 27px;
  }
`;

const Actions = styled.div`
  padding: 32px 32px 31px;

  & button {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 900px) {
    padding: 20px 22px 30px 18px;
  }

  @media (max-width: 768px) {
    padding: 20px 22px 50px 18px;
    display: flex;
    align-items: center;
    column-gap: 12px;
  }

  @media (min-width: 768px) {
    & > button {
      display: none;
    }
  }
`;

const TextfieldWrapper = styled.div`
  & input {
    border: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
    border-radius: 8px;
    background: transparent;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    flex: 1;

    & input {
      padding: 8px;
    }

    & svg {
      display: none;
    }
  }
`;

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #2a2a2a;
  opacity: 0.5;
  z-index: 10;

  @media (min-width: 768px) {
    display: none;
  }
`;

export default ChatPopup;
