import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getProfile } from "../../redux/reducers/profileReducer";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import DownloadTime from "../DownloadTime/DownloadTime";
import { FolderIcon, LogoIcon, NotificateIcon } from "../Icons/Icons";

import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const formatMinutes = (seconds: number) => {
  const integerMinutes = Math.floor(seconds / 60);
  const integerSeconds = seconds % 60;
  const minutesWording = `${integerMinutes} mins`;
  const secondsWording = integerSeconds > 0 ? `${integerSeconds} s` : ``;
  return `${minutesWording} ${secondsWording}`;
};

interface Props {
  children?: ReactNode;
  startAdornment?: ReactNode;
  withThemeSwitcher?: boolean;
}

const Navigation = ({ children, startAdornment, withThemeSwitcher = true }: Props) => {
  const profile = useSelector(getProfile);
  const [source, setSource] = useState("");
  const { pathname } = useLocation();

  const handleLoadingError = () => {
    setSource("/images/placeholder.png");
  };

  useEffect(() => {
    setSource(profile.profilePic);
  }, [profile.profilePic]);

  const totalSeconds = profile.aiVoicesAllowed;
  const usedSeconds = profile.aiVoicesUsed;
  const totalPercentage = 100;

  const downloadTime = {
    totalSeconds,
    usedSeconds,
    totalPercentage,
    usedPercentage: (100 - (totalPercentage * usedSeconds) / totalSeconds).toFixed(2),
  };

  const handleCustomshit = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.noticeable.do("widget:open", "HhSbAWQvk90PptShlFTC");
  };

  const hasUnlimited = profile.hasUnlimited;

  return (
    <Wrapper>
      {pathname !== "/actors" && pathname !== "/ai-humans" ? (
        <Link to="/">
          <LogoIcon />
        </Link>
      ) : startAdornment ? (
        startAdornment
      ) : (
        <div />
      )}
      <Content>
        {pathname !== "/actors" && pathname !== "/ai-humans" && (
          <DownloadTime
            hasUnlimited={hasUnlimited}
            title="Download time left"
            timeLeft={`${formatMinutes(totalSeconds - usedSeconds)} out of ${formatMinutes(totalSeconds)}`}
            progress={parseFloat(downloadTime.usedPercentage)}
          />
        )}
        {children}
        {withThemeSwitcher && <ThemeSwitcher />}
        {pathname !== "/actors" && pathname !== "/ai-humans" && (
          <Actions>
            <Link to="/my-studio">
              <IconButton iconButtonTheme={IconButtonThemes.Secondary} icon={<FolderIcon />} />
            </Link>
            <IconButton
              onClick={handleCustomshit}
              iconButtonTheme={IconButtonThemes.Secondary}
              icon={<NotificateIcon />}
              className="notificate"
            />
            <Link to="/settings">
              <ImageWrapper>{source ? <img src={source} alt="" onError={handleLoadingError} /> : <div />}</ImageWrapper>
            </Link>
          </Actions>
        )}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > a > svg {
    display: block;
    width: 230px;

    @media (max-width: 500px) {
      width: 150px;
    }
  }
`;

const Content = styled("div")`
  display: flex;
  align-items: center;
`;

const Actions = styled("div")`
  display: flex;
  align-items: center;
  gap: 12px;

  .notificate {
    padding: 0 !important;
  }

  @media (max-width: 1001px) {
    gap: 4px;
  }
`;

const ImageWrapper = styled("div")`
  width: 40px;
  height: 40px;

  & > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #d6d6d6;
  }
`;

export default Navigation;
