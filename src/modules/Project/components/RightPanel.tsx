/* eslint-disable prettier/prettier */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css, keyframes } from "styled-components";
import { AddIcon } from "../../../components/Icons/AddIcon";
import { MoreIcon } from "../../../components/Icons/MoreIcon";
import { PlayIcon } from "../../../components/Icons/PlayIcon";
import PopupModel from "../../../components/PopupModel/PopupModel";
import { clearActiveDraftSlide, deleteProjectSlideServer, getProjectSlideServer, setActiveDraftSlide, updateSlideStatusServer } from "../../../redux/actions/projectAction";
import { getProject, getSlidesData } from "../../../redux/reducers/projectReducer";

const formatTime = (s: number) => {
  if (isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

interface ActiveSlideInfo {
  slideId: number;
  isActive: boolean;
}

interface RightPanelProps {
  currentSlideId: number | null;
  setCurrentSlideId: (id: number | null) => void;
}

const RightPanelSide = ({ currentSlideId, setCurrentSlideId }: RightPanelProps) => {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const projectData = useSelector(getProject);
  const projectSlides = useSelector(getSlidesData);
  const [slides, setSlides] = useState<any>([]);
  const [slideData, setSlideData] = useState<any>({});
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [deleteSlideId, setDeleteSlideId] = useState<string | number | null>(null);
  const [activeSlideInfo, setActiveSlideInfo] = useState<ActiveSlideInfo | null>(null);

  const videoSrc = slideData?.audioPath;
  const thumbnailSrc = slideData?.backgroundAsset?.path ?? "https://picsum.photos/800/600";
  const totalSeconds =
    slides?.reduce((acc: number, slide: any) => acc + (slide.duration || 0), 0) || 0;

  const getSlideData = (projectId: number, slideId: number) => {
    dispatch(getProjectSlideServer(projectId, slideId));
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const formatShortDuration = (sec: number) => {
    if (!sec) return "0s";
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    if (remSec === 0) return `${min}m`;
    return `${min}m ${remSec}s`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // const currentIndex = slides?.findIndex(
    //   (slide: any) => slide.slideId === slideData?.slideId
    // );
    // const nextSlide = slides?.[currentIndex + 1];
    // if (nextSlide) {
    //   setCurrentSlideId(nextSlide.slideId);
    // }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSlideChange = (slideId: number | string) => {
    if (slideId === slideData?.slideId) return;
    const slide = slides?.find((s: any) => s.slideId == slideId);
    if (!slide) return;

    if (slide.slideId === 0) {
      dispatch(setActiveDraftSlide(slide));
      setSlideData(slide);
      setCurrentSlideId(0);
      return;
    }
    dispatch(clearActiveDraftSlide());
    setCurrentSlideId(slide.slideId);
  };

  const handleAddSlide = () => {
    const hasDraftSlide = slides?.some((slide: any) => slide.slideId === 0 || slide.isDraft);

    if (hasDraftSlide) return;
    const newSlide = {
      slideId: 0,
      order: 1,
      isDraft: true,
      backgroundAsset: { path: "" },
      totalDuration: 0,
      projectParagraphs: [],
    };
    setSlides((prev: any) => [...prev, newSlide]);
    setCurrentSlideId(0);
    setSlideData(newSlide);
    dispatch(setActiveDraftSlide(newSlide));
  };

  const handleDeleteSlide = (slideId: string | number) => {
    if (!projectData?.projectId) return;
    if (slideId !== 0) {
      dispatch(
        deleteProjectSlideServer({
          projectId: Number(projectData.projectId),
          slideId,
        }),
      );
    }
    const updatedSlides = slides.filter((s: any) => s.slideId !== slideId);
    setSlides(updatedSlides);
    setCurrentSlideId(slides[slides.length - 2].slideId)
    dispatch(clearActiveDraftSlide())
    setOpenMenuId(null);
  };

  const confirmDeleteSlide = () => {
    if (deleteSlideId === null) return;
    handleDeleteSlide(deleteSlideId);
    setDeleteSlideId(null);
  };

  const updateSlideStatus = async () => {
    if (!activeSlideInfo) return;
    dispatch(updateSlideStatusServer(Number(projectData?.projectId), activeSlideInfo?.slideId, !activeSlideInfo?.isActive));
    setActiveSlideInfo(null)
  }

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu-wrapper]")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!projectData) return;

    const targetId = currentSlideId || projectData.slides?.[0]?.slideId;
    const activeSlide = projectData.slides?.find((s: any) => s.slideId === targetId);

    if (activeSlide) {
      setSlideData(activeSlide);
      if (!currentSlideId) setCurrentSlideId(activeSlide.slideId);
    } else {
      setSlideData(projectData.slides?.[0] || {});
      setCurrentSlideId(projectData.slides?.[0]?.slideId || null);
    }
  }, [projectData, currentSlideId]);

  useEffect(() => {
    if (projectSlides) setSlides(projectSlides);

  }, [projectSlides]);

  useEffect(() => {
    if (currentSlideId === null || currentSlideId === undefined || currentSlideId === 0) return;
    getSlideData(Number(projectData?.projectId), Number(currentSlideId));
  }, [currentSlideId]);

  // Reload + autoplay when slideData changes
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.load();
    setIsPlaying(false);
  }, [slideData?.slideId]);

  return (
    <Wrapper>
      <RightHeader>
        <RightHeaderLeft>
          <StatusDot $active={isPlaying} />
          <RightTitle>Preview</RightTitle>
        </RightHeaderLeft>
        {duration > 0 && <DurationBadge>{formatTime(duration)}</DurationBadge>}
      </RightHeader>

      {/* ── Video Player ── */}
      <Content>
        {!videoSrc ? (
          <LockedOverlay>
            <LockMessage>
              This slide does not have any locked video. Please select and lock a video first.
            </LockMessage>
          </LockedOverlay>
        ) : (
          <PlayerCard>
            <StyledVideo
              ref={videoRef}
              controls
              // autoPlay
              poster={thumbnailSrc}
              preload="metadata"
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={`${process.env.REACT_APP_MEDIA_BASE_URL}${videoSrc}`} type="video/mp4" />
              Your browser does not support HTML5 video.
            </StyledVideo>
          </PlayerCard>
        )}
      </Content>

      {/* ── Slides Strip ── */}
      <SlidesSection>
        <SlidesMeta>
          <EstimatedLabel>
            Total length: <strong>{formatDuration(totalSeconds)}</strong>
          </EstimatedLabel>
          <SlideCount>
            {slides?.length ?? 0} slide{slides?.length !== 1 ? "s" : ""}
          </SlideCount>
        </SlidesMeta>

        <SlidesTrack>
          {slides?.map((slide: any, idx: number) => {
            const isActive = slideData?.slideId === slide.slideId;
            const thumb = slide?.backgroundAsset?.path ?? "/images/mock.png";
            return (
              <SlideFlowWrapper key={slide.slideId}>
                <SlideItem $active={isActive} onClick={() => handleSlideChange(slide.slideId)}>
                  <SlideThumbWrapper $active={isActive}>
                    {thumb ? (
                      <SlideThumbImg src={thumb} alt={`Slide ${idx + 1}`} />
                    ) : (
                      <SlideThumbEmpty>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <rect x="1" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                          <path
                            d="M13 7L17 5V13L13 11V7Z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </SlideThumbEmpty>
                    )}

                    {(slide?.isDraft === true || (!slide.isActive && currentSlideId !== slide.slideId)) && (
                      <InactiveOverlay>
                        <InactiveBadge>
                          {slide.isDraft === true ? "Draft" : !slide.isActive ? "Inactive" : ""}
                        </InactiveBadge>
                      </InactiveOverlay>
                    )}


                    <FloatingMoreBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) => (prev === slide.slideId ? null : slide.slideId));
                      }}
                    >
                      <MoreIcon />
                    </FloatingMoreBtn>

                    <SlideDurationBadge>{formatShortDuration(slide?.duration || 0)}</SlideDurationBadge>

                    {isActive && (
                      <ActiveOverlay onClick={(e) => {
                        e.stopPropagation();

                        if (videoRef.current) {
                          videoRef.current.play();
                          setIsPlaying(true);
                        }
                      }}>
                        <ActivePlayRing>
                          <PlayIcon />
                        </ActivePlayRing>
                      </ActiveOverlay>
                    )}
                  </SlideThumbWrapper>

                  {idx === slides.length - 1 && (
                    <InlineAddButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSlide();
                      }}
                    >
                      <AddIcon />
                    </InlineAddButton>
                  )}
                </SlideItem>

                {openMenuId === slide.slideId && (
                  <MoreMenu onClick={(e) => e.stopPropagation()}>
                    <MenuItem
                      onClick={() => {
                        setDeleteSlideId(slide.slideId);
                        setOpenMenuId(null);
                      }}
                    >
                      Delete
                    </MenuItem>
                    {slide.slideId !== 0 && (
                      <MenuItem
                        onClick={() => {
                          setActiveSlideInfo({
                            slideId: slide.slideId,
                            isActive: slide.isActive
                          });
                          setOpenMenuId(null);
                        }}
                      >
                        {slide.isActive == true ? "InActive" : "Active"}
                      </MenuItem>
                    )}
                  </MoreMenu>
                )}
              </SlideFlowWrapper>
            );
          })}
        </SlidesTrack>
      </SlidesSection>

      <PopupModel
        open={deleteSlideId !== null}
        title="Delete Slide"
        description="Are you sure you want to delete this slide?"
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setDeleteSlideId(null)}
        onConfirm={confirmDeleteSlide}
      />

      <PopupModel
        open={activeSlideInfo !== null}
        title={`${activeSlideInfo?.isActive ? "Inactive" : "Active"} Slide`}
        description={`Are you sure you want to ${activeSlideInfo?.isActive ? "inactive" : "active"
          } this slide?`}
        confirmText={activeSlideInfo?.isActive ? "Inactive" : "Active"}
        cancelText="Cancel"
        onClose={() => setActiveSlideInfo(null)}
        onConfirm={updateSlideStatus}
      />
    </Wrapper>
  );
};

export default RightPanelSide;

// Style

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,154,247,0.4); }
  50%       { box-shadow: 0 0 0 10px rgba(0,154,247,0); }
`;

const dotPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
`;

const Wrapper = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.primaryBackground};

  @media (max-width: 768px) {
    width: 100%;
    min-height: auto;
    height: auto;
    overflow: visible;
    flex: none;
  }
`;

const RightHeader = styled.div`
  height: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
  flex-shrink: 0;
  background: ${({ theme }) => theme.primaryBackground};
`;

const RightHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.span<{ $active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $active }) => ($active ? "#31DFCA" : "rgba(128,128,128,0.35)")};
  transition: background 0.3s;
  ${({ $active }) =>
    $active &&
    css`
      animation: ${dotPulse} 1.4s ease infinite;
    `}
`;

const RightTitle = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.primaryText};
`;

const DurationBadge = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  background: ${({ theme }) =>
    theme.primaryBackground === "#F0F0F3" ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"};
  color: ${({ theme }) => theme.editorFileUpload};
  letter-spacing: 0.02em;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 10px;
    flex: none;
    min-height: auto;
  }
`;

const PlayerCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  border-radius: 14px;
  overflow: hidden;
  background: #0d0e10;
  border: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: #000;

  /* Make native controls always visible and styled nicely */
  &::-webkit-media-controls {
    display: flex !important;
  }
`;

const SlidesSection = styled.div`
  flex-shrink: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 0 12px;
  border-top: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
  background: ${({ theme }) => theme.primaryBackground};
  overflow: hidden;

  @media (max-width: 768px) {
    padding-bottom: 8px;
  }
`;

const SlidesMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  gap: 8px;
`;

const EstimatedLabel = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.editorFileUpload};
  flex: 1;

  strong {
    color: ${({ theme }) => theme.primaryText};
    font-weight: 700;
  }
`;

const SlideCount = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
  background: ${({ theme }) =>
    theme.primaryBackground === "#F0F0F3" ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"};
  color: ${({ theme }) => theme.editorFileUpload};
`;

const SlidesTrack = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 2px 14px 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SlideItem = styled.div<{ $active: boolean }>`
  position: relative;
  width: 142px;
  height: 90px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  transition: transform 0.18s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SlideThumbWrapper = styled.div<{ $active: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.activeMenu ?? "#009AF7" : theme.chatTextfieldBorder)};
  background: ${({ theme }) => theme.editorDropDownContent ?? "#1a1b1e"};
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 3px rgba(0,154,247,0.2), 0 4px 12px rgba(0,0,0,0.2)" : "none"};

  &:hover {
    border-color: ${({ theme }) => theme.activeMenu ?? "#009AF7"};
  }
`;

const SlideThumbImg = styled.img<{ $inactive?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  display: block;
  opacity: ${({ $inactive }) => ($inactive ? 0.4 : 1)};
  transition: opacity 0.2s ease;
`;

const InactiveOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

// "Inactive" label badge
const InactiveBadge = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3px 7px;
  border-radius: 20px;
  backdrop-filter: blur(6px);
`;

const SlideThumbEmpty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.editorFileUpload};
  opacity: 0.35;
`;

const ActiveOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 154, 247, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActivePlayRing = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 154, 247, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 0 6px rgba(0, 154, 247, 0.2);
  animation: ${pulse} 2s ease infinite;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const SlideDurationBadge = styled.span`
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: "Montserrat", sans-serif;
  font-size: 8px;
  font-weight: 700;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
`;

const SlideFlowWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-right: 18px;
`;

const FloatingMoreBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 15;
  transition: all 0.18s ease;

  &:hover {
    transform: scale(1.08);
    background: white;
  }

  &:active {
    transform: scale(0.94);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const InlineAddButton = styled.button`
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: #fff;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22), 0 0 0 3px rgba(0, 0, 0, 0.12);
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-50%) scale(1.08);
  }

  &:active {
    transform: translateY(-50%) scale(0.94);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const MoreMenu = styled.div`
  position: absolute;
  top: 10px;
  right: 0;

  min-width: 140px;
  padding: 6px;

  border-radius: 14px;

  background: ${({ theme }) => theme.primaryBackground};
  border: 1px solid ${({ theme }) => theme.chatTextfieldBorder};

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 2px 10px rgba(0, 0, 0, 0.06);

  backdrop-filter: blur(14px);

  z-index: 999;

  display: flex;
  flex-direction: column;
  gap: 2px;

  animation: fadeMenu 0.16s ease;

  @keyframes fadeMenu {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const MenuItem = styled.button<{ danger?: boolean }>`
  width: 100%;
  border: none;
  background: transparent;

  padding: 10px 12px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  gap: 10px;

  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 500;

  color: ${({ danger, theme }) =>
    danger ? "#FF4D4F" : theme.primaryText};

  cursor: pointer;

  transition:
    background 0.16s ease,
    color 0.16s ease,
    transform 0.12s ease;

  &:hover {
    background: ${({ danger }) =>
    danger
      ? "rgba(255,77,79,0.10)"
      : "rgba(0,154,247,0.08)"};

    transform: translateX(2px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LockedOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LockMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // color: #fff;
  // background: rgba(0, 0, 0, 0.6);
  // padding: 8px 12px;
  // border-radius: 6px;
  // font-size: 14px;
  // text-align: center;
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  color: ${({ theme }) => theme.editorFileUpload};
  opacity: 0.6;
  text-align: center;
  padding: 20px 12px;
  line-height: 1.5;
`;