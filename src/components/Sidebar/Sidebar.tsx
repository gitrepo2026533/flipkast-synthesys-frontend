import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import Button from "../Button/Button";
import { pages } from "../../lib/routeUtils";
import { products } from "../../mocks/products";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import {
  HomeIcon,
  PlanIcon,
  SettingsIcon,
  SharedIcon,
  StudioIcon,
  SupportIcon,
  UpdatesIcon,
  LogoutIcon,
  ChatAPIIcon,
} from "../Icons/Icons";
import { logout } from "../../redux/actions/authActions";
import { getMyProfileServer } from "../../redux/actions/profileActions";
import { getCheckCloneVoiceLoading, getProfile } from "../../redux/reducers/profileReducer";
import CircularProgress from "../Icons/CircularProgress";
import { useEffect, useRef, useState } from "react";
import ArrowDown from "../Icons/ArrowDown";
import { AIVideoGenerationIcon } from "../Icons/AIVideoGenerationIcon";

interface Props {
  mobile?: boolean;
}

const Sidebar = ({ mobile }: Props) => {
  const isFirstRender = useRef(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { voiceCloneAllowed = 0, isAPIKey } = useSelector(getProfile);
  const checkCloneVoiceLoading = useSelector(getCheckCloneVoiceLoading);
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState<string>("");

  const handleOpen = () => setOpen(!open);
  const handleActivePage = (link: string) => setActivePage(link);

  useEffect(() => {
    if (isFirstRender.current && location.pathname === "/api-access") {
      handleActivePage(location.pathname);
      setOpen(true);

      isFirstRender.current = false;
    }
  }, [location]);

  const navigationList = [
    { id: 1, title: "Home", icon: <HomeIcon />, link: pages.main() },
    { id: 2, title: "My plan", icon: <PlanIcon />, link: "#", disabled: true },
    { id: 3, title: "My studio", icon: <StudioIcon />, link: pages.myStudio() },
    { id: 4, title: "Voice Cloning", icon: <SharedIcon />, link: "#", hidden: voiceCloneAllowed === 0 },
    { id: 5, title: "Support", icon: <SupportIcon />, link: "#" },
    { id: 6, title: "Training", icon: <SupportIcon />, link: "#" },
    {
      id: 7,
      title: "Voice API",
      icon: <ChatAPIIcon />,
      link: "#",
      options: [{ id: "API Access", title: "API Access", link: pages.apiAccess() }],
    },
    {
      id: 8,
      title: "AI Video Generation",
      icon: <AIVideoGenerationIcon />,
      link: "/ai-video",
    },
    { id: 9, title: "Settings", icon: <SettingsIcon />, link: pages.settings() },
    { id: 10, title: "Logout", icon: <LogoutIcon />, link: "" },
  ];

  const handleOpenPopup = () => {
    dispatch(
      updatePopup({
        popup: Popups.createNewProjectPopup,
        status: true,
        prefilled: products,
      }),
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Wrapper mobile={mobile}>
      <Content>
        {navigationList.map(({ id, title, icon, link, disabled, hidden, options }) =>
          hidden ? (
            <></>
          ) : title !== "Voice API" ? (
            <Link key={`${title} - ${id}`} to={link ? link : "/"}>
              <ListItemButton
                active={link === location.pathname}
                disabled={disabled}
                onClick={() => {
                  !link && handleLogout();
                  title === "Support" && window?.open("https://flipcast.freshdesk.com/a/", "_blank")?.focus();
                  title === "Training" && dispatch(updatePopup({ popup: Popups.vimeoPopup, status: true }));
                  title === "Voice Cloning" && dispatch(getMyProfileServer(true));
                }}
              >
                <ListItemIcon active={link === location.pathname}>{icon}</ListItemIcon>
                <ListItemTitle active={link === location.pathname}>{title}</ListItemTitle>
                {checkCloneVoiceLoading && title === "Voice Cloning" && (
                  <CircularProgressWrapper>
                    <CircularProgress color="#009af7" />
                  </CircularProgressWrapper>
                )}
              </ListItemButton>
            </Link>
          ) : (
            isAPIKey && (
              <Link key={`${title} - ${id}`} to={link ? link : "/"}>
                <ListItemButtonWrapper active={activePage === "/api-access"}>
                  <ListItemButton onClick={handleOpen}>
                    <ListItemIcon active={activePage === "/api-access"}>{icon}</ListItemIcon>
                    <ListItemTitle active={activePage === "/api-access"}>{title}</ListItemTitle>
                    <ListItemIcon active={activePage === "/api-access"} isOpen={open} variant="dropdown">
                      <ArrowDown />
                    </ListItemIcon>
                  </ListItemButton>
                  {open &&
                    options?.map(({ id, title, link }) => (
                      <Link key={`${title} - ${id}`} to={link ? link : "/"}>
                        <ListItemButton
                          active={link === activePage}
                          variant="dropdown"
                          onClick={() => handleActivePage(link)}
                        >
                          <ListItemTitle active={link === location.pathname}>{title}</ListItemTitle>
                        </ListItemButton>
                      </Link>
                    ))}
                </ListItemButtonWrapper>
              </Link>
            )
          ),
        )}
        <ButtonWrapper>
          <Button text="Create new project" onClick={handleOpenPopup} />
        </ButtonWrapper>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled("div")<{ mobile?: boolean }>`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  padding: 3px;
  box-shadow: ${({ theme }) => theme.cardShadow};

  @media (max-width: 1001px) {
    display: none;
  }

  ${({ mobile }) =>
    mobile &&
    `
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
    box-shadow: none;
    padding: 0;
  `};
`;

const Content = styled("div")`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  padding: 12px;
  gap: 8px;

  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden auto;

  @media (max-height: 720px) {
    padding: 8px 12px;
    gap: 6px;
  }

  @media (max-width: 1001px) {
    flex-direction: row;
    background-color: none;
    box-shadow: none;
    border-radius: 0;
    gap: 8px;
    padding: 0;
    height: 60px;
    overflow: auto;

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ListItemButtonWrapper = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;

  & > div,
  & > a > div {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    margin-bottom: 0;
  }

  ${({ active, theme }) =>
    active &&
    `
      background: ${theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      border: 1px solid ${theme.activeMenu};
      text-fill-color: transparent;
  `}

  @media (max-width: 1001px) {
    flex-direction: row;
  }
`;

const ListItemButton = styled("div")<{ active?: boolean; disabled?: boolean; variant?: string }>`
  height: 44px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  padding-left: 18px;
  padding-right: 18px;
  gap: 10.5px;

  ${({ variant, active, theme }) =>
    variant !== "dropdown" &&
    active &&
    `
      background: ${theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      border: 1px solid ${theme.activeMenu};
      text-fill-color: transparent;
  `}

  ${({ variant, active, theme }) =>
    variant === "dropdown" &&
    active &&
    `
     background: ${theme.sidebarDropdownMenu} !important;
    `}

  ${({ disabled, theme }) =>
    disabled &&
    `
      opacity: 0.5;
  `}

  @media (max-height: 720px) {
    margin-bottom: 6px;
    height: 36px;
  }

  @media (max-width: 1001px) {
    width: max-content;
    height: 44px;
  }
`;

const ListItemIcon = styled("div")<{ active: boolean; isOpen?: boolean; variant?: string }>`
  display: flex;

  ${({ variant }) =>
    variant === "dropdown" &&
    `
      margin-left: auto;

      @media (max-width: 1001px) {
        transform: rotate(-90deg);
      }
    `}

  ${({ variant, isOpen }) =>
    variant === "dropdown" &&
    isOpen &&
    `
      svg {
        transform: rotate(-180deg);
      }
    `}

  svg > path,
  svg > g,
  svg > g > path {
    fill: ${({ theme }) => theme.sidebarIcon};
    opacity: 0.6;

    ${({ active, theme }) =>
      active &&
      `
        fill: ${theme.activeMenu};
        opacity: 1;
    `};
  }
`;

const ListItemTitle = styled("span")<{ active: boolean }>`
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.sidebarMenuText};
  opacity: 0.6;

  ${({ active, theme }) =>
    active &&
    `
        background: ${theme.activeMenu};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        opacity: 1;
    `}
`;

const CircularProgressWrapper = styled("div")`
  margin-left: auto;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ButtonWrapper = styled("div")`
  margin-top: auto;
  width: 100%;

  @media (max-height: 720px) {
    button {
      height: 36px;
      font-size: 14px;
      line-height: 20px;
    }
  }

  @media (max-width: 1001px) {
    display: none;
  }
`;

export default Sidebar;
