import React from "react";
import styled from "styled-components";
import Button, { ButtonThemes } from "../Button/Button";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { PlayIcon } from "../Icons/PlayIcon";
import Modal from "../Modal/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ShareVideoLinkPopup = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} onClose={onClose} closeIcon={false}>
      <Wrapper>
        <ImageWrapper>
          <Image src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg" />
        </ImageWrapper>
        <Row>
          <Left>
            <StyledIconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlayIcon />} />
            <VideoName>Coworking place in Berlin</VideoName>
          </Left>
          <Duration>00:40</Duration>
        </Row>
        <Actions>
          <Button text="Cancel" onClick={onClose} buttonTheme={ButtonThemes.Outline} />
          <Button text="Share video" type="submit" />
        </Actions>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const ImageWrapper = styled.div`
  width: 600px;
  height: 368px;
  overflow: hidden;
  box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(174, 174, 192, 0.3), inset -2px -2px 4px rgba(0, 0, 0, 0.1),
    inset 2px 2px 4px #ffffff;
  border-radius: 20px;

  @media (max-width: 690px) {
    width: 366px;
    height: 250px;
  }

  @media (max-width: 438px) {
    width: 100%;
    height: 172px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  flex: 1;
`;

const StyledIconButton = styled(IconButton)`
  @media (max-width: 438px) {
    width: 24px;
    height: 24px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const VideoName = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #191b1f;
  letter-spacing: -1px;

  @media (max-width: 690px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

const Duration = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #191b1f;

  @media (max-width: 690px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

const Actions = styled.div`
  display: flex;
  column-gap: 24px;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;

  button {
    width: 160px;
  }
`;

export default ShareVideoLinkPopup;
