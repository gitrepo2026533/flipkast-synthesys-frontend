/* eslint-disable prettier/prettier */
import React from "react";
import styled from "styled-components";
import IconButton from "../../../components/Button/IconButton";
import { PlayIcon, TrackIcon } from "../../../components/Icons/Icons";

interface Props {
  image: string;
  title: string;
  description?: string;
  date?: string;
  audio?: string;
  video?: string;
}

const SignInCard = ({ image, title, description, date, audio, video }: Props) => {
  return (
    <Wrapper>
      <Content>
        <ImageWrapper>
          <Image src={image} alt="" />
          {date && (
            <Date>
              <span>{date}</span>
            </Date>
          )}
          {audio && (
            <AudioWrapper>
              <IconButtonWrapper>
                <PlayIcon />
              </IconButtonWrapper>
              <TrackWrapper>
                <TrackIcon />
                <span>00:12</span>
              </TrackWrapper>
            </AudioWrapper>
          )}
          {video && (
            <VideoWrapper>
                <PlayIcon />
            </VideoWrapper>
          )}
        </ImageWrapper>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px 16px 24px 16px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: end;
  margin-bottom: 12px;
`;

const Image = styled.img`
  border-radius: 10px;
  width: 208px;
  height: 208px;
  object-fit: cover;
  position: relative;
`;

const Date = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 4px 6px;
  background: ${({ theme }) => theme.white}33;
  backdrop-filter: blur(2px);
  border-radius: 8px;

  span {
    font-family: "Montserrat";
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.white};
  }
`;

const AudioWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 9px 9px 8px;
  background: ${({ theme }) => theme.white}99;
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 7px;
`;

const IconButtonWrapper = styled.div`
  padding: 4.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.white};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;

  svg {
    width: 13px;
    height: 13px;
    transform: translateX(1px);

        path {
            fill: ${({ theme }) => theme.activeMenu};
        }
    }
`;

const TrackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  span {
    font-family: 'Montserrat';
    font-weight: 500;
    font-size: 7.5px;
    line-height: 9px;
    color: ${({ theme }) => theme.darkText};
    opacity: 0.4;
  }
`;

const VideoWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 9px;
    width: 48px;
    height: 48px;
    background: ${({ theme }) => theme.white}b2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
    width: 27px;
    height: 27px;
    transform: translateX(2px);

        path {
            fill: ${({ theme }) => theme.activeMenu};
        }
    }
`;

const Title = styled.span`
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.primaryText};
`;

const Description = styled.span`
  margin-top: 8px;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.41px;
  background: ${({ theme }) => theme.button};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  cursor: pointer;
`;

export default SignInCard;
