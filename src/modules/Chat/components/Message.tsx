import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AvatarCircle from "../../../components/AvatarCircle/AvatarCircle";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import CircularProgress from "../../../components/Icons/CircularProgress";
import { CopyIcon } from "../../../components/Icons/CopyIcon";
import { DownloadImageIcon } from "../../../components/Icons/DownloadImageIcon";
import { RefreshMessageIcon } from "../../../components/Icons/RefreshMessageIcon";
import { getProfile } from "../../../redux/reducers/profileReducer";

export enum MessageSender {
  user = "user",
  bot = "bot",
}

interface Props {
  text?: string;
  sender: MessageSender;
  images?: string[];
  isLoading?: boolean;
  showActions?: boolean;
  handleRefresh?: () => void;
  isLast?: boolean;
}

const Message = ({ text, sender, showActions = true, images, isLoading = false, handleRefresh, isLast }: Props) => {
  const profile = useSelector(getProfile);

  const getImagesInRow = (len: number, index: number) => {
    if (len < 4) return len;
    if (len === 4) return 2;
    return index < 2 ? 2 : 3;
  };

  const downloadImages = async () => {
    if (!images) return;
    for (const imageUrl of images) {
      const originalImage = imageUrl;
      const image = await fetch(originalImage);

      const nameSplit = originalImage.split("/");
      const duplicateName = nameSplit.pop();

      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "" + duplicateName + "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const displayMoreImagesCard = !!images?.length && images.length > 4;

  return (
    <Wrapper sender={sender}>
      {isLoading ? (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      ) : (
        <>
          <AssistantAvatarWrapper sender={sender}>
            <AvatarCircle
              image={sender === MessageSender.bot ? "/images/SynthesysAssistant.svg" : profile.profilePic}
              width={32}
              height={32}
            />
          </AssistantAvatarWrapper>
          <MessageWrapper sender={sender}>
            {!!images?.length && (
              <ImagesWrapper>
                {images.slice(0, 4).map((src, index) => (
                  <Image key={src} src={src} cardsInRow={getImagesInRow(images.length, index)} />
                ))}
                {displayMoreImagesCard && (
                  <MoreImagesCard>
                    <MessageText>+{images.length - 4} images</MessageText>
                  </MoreImagesCard>
                )}
              </ImagesWrapper>
            )}
            {text && <MessageText>{text}</MessageText>}
            {showActions && sender === MessageSender.bot && (
              <MessageActions>
                {text && (
                  <IconButton onClick={copyText} iconButtonTheme={IconButtonThemes.Transparent} icon={<CopyIcon />} />
                )}
                {!!images?.length && (
                  <IconButton
                    onClick={downloadImages}
                    iconButtonTheme={IconButtonThemes.Transparent}
                    icon={<DownloadImageIcon />}
                  />
                )}
                {isLast && (
                  <IconButton
                    onClick={handleRefresh}
                    iconButtonTheme={IconButtonThemes.Transparent}
                    icon={<RefreshMessageIcon />}
                  />
                )}
              </MessageActions>
            )}
          </MessageWrapper>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ sender: MessageSender }>`
  display: flex;
  column-gap: 14px;
  align-items: flex-end;
  flex-direction: ${({ sender }) => (sender === MessageSender.bot ? "row" : "row-reverse")};
`;

const AssistantAvatarWrapper = styled.div<{ sender: MessageSender }>`
  & > div {
    background: ${({ sender }) => (sender === MessageSender.bot ? "#414155" : "transparent")};
  }
`;

const MessageWrapper = styled.div<{ sender: MessageSender }>`
  padding: 12px 16px;
  color: ${({ sender, theme }) => (sender === MessageSender.bot ? theme.chatText : "#FFFFFF")};
  background: ${({ sender, theme }) => (sender === MessageSender.bot ? theme.messageBackground : "#1681D7")};
  text-align: ${({ sender }) => (sender === MessageSender.bot ? "left" : "right")};
  border-radius: 8px;
  max-width: 75%;
  display: flex;
  flex-direction: column;
  row-gap: 14px;

  @media (max-width: 900px) {
    padding: 8px 10px;
  }
`;

const ImagesWrapper = styled.div`
  display: flex;
  row-gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const MessageText = styled.span`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;

  @media (max-width: 1500px) {
    font-size: 14px;
  }
`;

const MessageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 24px;
  align-items: center;

  & path {
    stroke: #6a6a7c;
  }

  & button:hover path {
    stroke: #00b8e0;
  }
`;

const Image = styled.img<{ cardsInRow: number }>`
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  width: calc(100% / ${({ cardsInRow }) => cardsInRow} - 5px);
`;

const MoreImagesCard = styled.div`
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  width: calc(100% / 3 - 5px);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #b8b8b8;
`;

const LoaderWrapper = styled.div`
  & path {
    fill: ${({ theme }) => theme.activeMenu};
  }
`;

export default Message;
