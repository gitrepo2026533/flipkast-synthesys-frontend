/* eslint-disable prettier/prettier */
import styled, { keyframes, css } from "styled-components";
import { useEffect, useRef, useState, useCallback } from "react";
import { getProject, getSlidesData } from "../../../redux/reducers/projectReducer";
import { useDispatch, useSelector } from "react-redux";
import { clearActiveDraftSlide, getProjectSlideServer, setActiveDraftSlide } from "../../../redux/actions/projectAction";
import { deleteProjectserver, deleteProjectSlideServer } from "../../../redux/actions/projectAction";

/* ─────────────────────────── Icons ─────────────────────────── */

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M6 3.5L16.5 10L6 16.5V3.5Z" fill="currentColor" />
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="5" y="3" width="3.5" height="14" rx="1.5" fill="currentColor" />
    <rect x="11.5" y="3" width="3.5" height="14" rx="1.5" fill="currentColor" />
  </svg>
);

const MoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="2.5" cy="7" r="1.2" fill="currentColor" />
    <circle cx="7" cy="7" r="1.2" fill="currentColor" />
    <circle cx="11.5" cy="7" r="1.2" fill="currentColor" />
  </svg>
);

const AddIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const VolumeIcon = ({ muted }: { muted: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    {muted ? (
      <>
        <path d="M2 5.5H5L9 2.5V13.5L5 10.5H2V5.5Z" fill="currentColor" opacity="0.5" />
        <path d="M12 6L14.5 8.5M14.5 6L12 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M2 5.5H5L9 2.5V13.5L5 10.5H2V5.5Z" fill="currentColor" />
        <path
          d="M11.5 5C12.5 6 13 7 13 8C13 9 12.5 10 11.5 11"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

const FullscreenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M1.5 5V2H4.5M9.5 2H12.5V5M12.5 9V12H9.5M4.5 12H1.5V9"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReplayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3.5 9A5.5 5.5 0 1 0 5.2 5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3.5 5.5V9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const formatTime = (s: number) => {
  if (isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const RightPanelSide = () => {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectData = useSelector(getProject);
  const projectSlides = useSelector(getSlidesData);
  const [slides, setSlides] = useState<any>([]);
  const [slideData, setSlideData] = useState<any>({});
  const [currentSlideId, setCurrentSlideId] = useState<number | null>(null);

  const videoSrc = slideData?.audioPath;
  const thumbnailSrc = slideData?.backgroundAsset?.path ?? "https://picsum.photos/800/600";

  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [deleteSlideId, setDeleteSlideId] = useState<string | number | null>(null);
  const [panelLoading, setPanelLoading] = useState(true);

  /* ── Auto-hide controls ── */
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 2800);
    }
  }, [isPlaying]);

  const getSlideData = (
    projectId: number,
    slideId: number
  ) => {
    dispatch(
      getProjectSlideServer(
        projectId,
        slideId
      )
    );
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
    setShowControls(true);
    const currentIndex = slides?.findIndex(
      (slide: any) =>
        slide.slideId === slideData?.slideId
    );

    const nextSlide = slides?.[currentIndex + 1];
    if (nextSlide) {
      setCurrentSlideId(nextSlide.slideId);
    }
  };

  const handleWaiting = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isEnded) {
      v.currentTime = 0;
      setIsEnded(false);
    }
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play();
      setIsPlaying(true);
    }
    resetControlsTimer();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    if (!v) return;
    v.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
  };

  const totalSeconds = slides?.reduce((acc: number, slide: any) => acc + (slide.totalDuration || 0), 0) || 0;
  const totalFormatted = `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(
    totalSeconds % 60,
  ).padStart(2, "0")}`;

  const handleSlideChange = (slideId: number | string) => {
    if (slideId === slideData?.slideId) return;
    const slide = slides?.find((s: any) => s.slideId == slideId);
    if (!slide) return;

    // Draft slide
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
    const newSlide = {
      slideId: 0,
      order: 1,
      // slideBackgroundColor: "",
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

    dispatch(
      deleteProjectSlideServer({
        projectId: Number(projectData.projectId),
        slideId,
      }),
    );
    const updatedSlides = slides.filter((s: any) => s.slideId !== slideId);

    setSlides(updatedSlides);

    // if deleted slide was active
    // if (currentSlides?.slideId === slideId) {
    //   setCurrentSlides(updatedSlides[0] || null);
    // }

    setOpenMenuId(null);
  };

  const confirmDeleteSlide = () => {
    if (deleteSlideId === null) return;

    handleDeleteSlide(deleteSlideId);
    setDeleteSlideId(null);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // if clicked outside menu + button
      if (!target.closest("[data-menu-wrapper]")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (!projectData) return;
    const selectedProject = projectData;
    setSlideData(selectedProject?.slides?.[0] || {});
    setCurrentSlideId(selectedProject?.slides?.[0]?.slideId || null);
  }, [projectData]);

  useEffect(() => {
    if (projectSlides) {
      setSlides(projectSlides);
    }
  }, [projectSlides]);

  useEffect(() => {
    if (currentSlideId === null || currentSlideId === undefined) return;

    // Draft slide
    if (currentSlideId === 0) return;

    getSlideData(
      Number(projectData?.projectId),
      Number(currentSlideId)
    );
  }, [currentSlideId]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [isPlaying, resetControlsTimer]);

  useEffect(() => {
    setIsPlaying(false);
    setIsEnded(false);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setShowControls(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
    }
  }, [slideData?.slideId]);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.load();

      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => { console.log("error") });
    }
  }, [videoSrc]);

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
            {/* <FallbackThumb src={thumbnailSrc} alt="slide preview" /> */}
            <LockMessage>This slide does not have any locked video. Please select and lock a video first.</LockMessage>
          </LockedOverlay>
        ) : (
          <PlayerCard
            onMouseMove={resetControlsTimer}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video element */}
            {videoSrc ? (
              <StyledVideo
                ref={videoRef}
                src={`http://192.168.1.80:7132${videoSrc}`}
                poster={thumbnailSrc}
                preload="metadata"
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onWaiting={handleWaiting}
                onCanPlay={handleCanPlay}
                onClick={togglePlay}
              />
            ) : (
              <FallbackThumb src={thumbnailSrc} alt="slide preview" />
            )}

            {/* Gradient overlays */}
            <GradientTop />
            <GradientBottom />

            {/* Loading spinner */}
            {isLoading && (
              <SpinnerOverlay>
                <Spinner />
              </SpinnerOverlay>
            )}

            {/* Big center play/pause on click feedback */}
            <CenterClickArea onClick={togglePlay} />

            {/* Controls overlay */}
            <ControlsOverlay $visible={showControls || !isPlaying}>
              {/* Slide title */}
              <SlideLabel>
                {slideData?.customTexts?.[0]?.text && (
                  <SlideTitleText> — {slideData.customTexts[0].text}</SlideTitleText>
                )}
              </SlideLabel>

              {/* Center play/pause/replay */}
              <CenterBtn onClick={togglePlay}>
                {isEnded ? <ReplayIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
              </CenterBtn>

              {/* Bottom controls bar */}
              <BottomBar>
                {/* Progress bar */}
                <ProgressTrack ref={progressRef} onClick={handleProgressClick}>
                  <ProgressBuffered style={{ width: `${buffered}%` }} />
                  <ProgressFill style={{ width: `${progressPct}%` }} />
                  <ProgressThumb style={{ left: `${progressPct}%` }} />
                </ProgressTrack>

                <ControlsRow>
                  <ControlsLeft>
                    <CtrlBtn onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </CtrlBtn>

                    <VolumeGroup>
                      <CtrlBtn onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                        <VolumeIcon muted={isMuted} />
                      </CtrlBtn>
                      <VolumeSlider
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                      />
                    </VolumeGroup>

                    <TimeLabel>
                      {formatTime(currentTime)}
                      <TimeSep>/</TimeSep>
                      {formatTime(duration)}
                    </TimeLabel>
                  </ControlsLeft>

                  <ControlsRight>
                    <CtrlBtn onClick={handleFullscreen} title="Fullscreen">
                      <FullscreenIcon />
                    </CtrlBtn>
                  </ControlsRight>
                </ControlsRow>
              </BottomBar>
            </ControlsOverlay>

            {/* Empty state */}
            {/* {!videoSrc && !thumbnailSrc && (
            <EmptyPlayer>
              <EmptyIcon>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="2" y="8" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M30 15L38 11V29L30 25V15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </EmptyIcon>
              <EmptyText>No video selected</EmptyText>
            </EmptyPlayer>
          )} */}
          </PlayerCard >
        )}
      </Content >

      {/* ── Slides Strip ── */}
      <SlidesSection>
        <SlidesMeta>
          <EstimatedLabel>
            Total length: <strong>{totalFormatted}</strong>
          </EstimatedLabel>
          <SlideCount>
            {slides?.length ?? 0} slide{slides?.length !== 1 ? "s" : ""}
          </SlideCount>
        </SlidesMeta>

        <SlidesTrack>
          {slides?.map((slide: any, idx: number) => {
            const isActive = slideData?.slideId === slide.slideId;
            const thumb = slide?.backgroundAsset?.path ?? "https://picsum.photos/536/354";
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

                    {/* more button */}
                    <FloatingMoreBtn
                      onClick={(e) => {
                        e.stopPropagation();

                        setOpenMenuId((prev) => (prev === slide.slideId ? null : slide.slideId));
                      }}
                    >
                      <MoreIcon />
                    </FloatingMoreBtn>

                    {/* duration */}
                    <SlideDurationBadge>{slide.totalDuration || 0}s</SlideDurationBadge>

                    {isActive && (
                      <ActiveOverlay>
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
                {/* dropdown menu */}
                {openMenuId === slide.slideId && (
                  <MoreMenu
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setDeleteSlideId(slide.slideId);
                        setOpenMenuId(null);
                      }}
                    >
                      Delete
                    </MenuItem>
                  </MoreMenu>
                )}
              </SlideFlowWrapper>
            );
          })}
        </SlidesTrack>
      </SlidesSection>

      {deleteSlideId !== null && (
        <DeleteOverlay
          onClick={() => {
            setDeleteSlideId(null);
          }}
        >
          <DeleteModal
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DeleteTitle>Delete Slide?</DeleteTitle>

            <DeleteText>Are you sure you want to delete this slide?</DeleteText>

            <DeleteActions>
              <CancelBtn onClick={() => setDeleteSlideId(null)}>Cancel</CancelBtn>

              <DeleteBtn onClick={confirmDeleteSlide}>Delete</DeleteBtn>
            </DeleteActions>
          </DeleteModal>
        </DeleteOverlay>
      )}
    </Wrapper>
  );
};

export default RightPanelSide;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,154,247,0.4); }
  50%       { box-shadow: 0 0 0 10px rgba(0,154,247,0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const dotPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  padding: 0 18px;
  border-bottom: 1px solid ${({ theme }) => theme.editorLineBorder};
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
  background: ${({ theme }) => (theme.primaryBackground === "#F0F0F3" ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)")};
  color: ${({ theme }) => theme.editorFileUpload};
  letter-spacing: 0.02em;
`;

/* ─────────────────────────── Player ─────────────────────────── */

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
  border: 1px solid ${({ theme }) => theme.editorLineBorder};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    max-height: none;
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
  background: #000;
`;

const FallbackThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
`;

const GradientTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent);
  pointer-events: none;
`;

const GradientBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent);
  pointer-events: none;
`;

const SpinnerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: #009af7;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

const CenterClickArea = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

/* ── Controls overlay ── */
const ControlsOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 14px 0;
  z-index: 5;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.28s ease;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
`;

const SlideLabel = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  pointer-events: none;
`;

const SlideTitleText = styled.span`
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.7;
`;

const CenterBtn = styled.button`
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    background: rgba(0, 154, 247, 0.4);
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 0 8px rgba(0, 154, 247, 0.12);
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.94);
  }
`;

/* ── Bottom bar ── */
const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 0 10px;
`;

const ProgressTrack = styled.div`
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 99px;
  cursor: pointer;
  margin: 0 2px;

  &:hover {
    height: 6px;
    margin-top: -1px;
  }

  transition: height 0.15s, margin 0.15s;
`;

const ProgressBuffered = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 99px;
  transition: width 0.2s ease;
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #009af7, #31dfca);
  border-radius: 99px;
  transition: width 0.1s linear;
`;

const ProgressThumb = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  transition: left 0.1s linear;
  pointer-events: none;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ControlsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ControlsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CtrlBtn = styled.button`
  all: unset;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const VolumeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 56px;
  height: 3px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
  }
`;

const TimeLabel = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.04em;
  white-space: nowrap;
`;

const TimeSep = styled.span`
  opacity: 0.4;
  margin: 0 3px;
`;

/* ── Empty state ── */
const EmptyPlayer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.25);
  user-select: none;
  pointer-events: none;
`;

const EmptyIcon = styled.div``;

const EmptyText = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 500;
  margin: 0;
`;

/* ─────────────────────────── Slides Strip ─────────────────────────── */

const SlidesSection = styled.div`
  flex-shrink: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 0 12px;
  border-top: 1px solid ${({ theme }) => theme.editorLineBorder};
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
  background: ${({ theme }) => (theme.primaryBackground === "#F0F0F3" ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)")};
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
  border: 2px solid ${({ $active, theme }) => ($active ? theme.activeMenu ?? "#009AF7" : theme.editorLineBorder)};
  background: ${({ theme }) => theme.editorDropDownContent ?? "#1a1b1e"};
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${({ $active }) => ($active ? "0 0 0 3px rgba(0,154,247,0.2), 0 4px 12px rgba(0,0,0,0.2)" : "none")};

  &:hover {
    border-color: ${({ theme }) => theme.activeMenu ?? "#009AF7"};
  }
`;

const SlideThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  display: block;
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
  top: 6px;
  right: 0;

  min-width: 110px;
  padding: 6px;

  border-radius: 10px;

  background: ${({ theme }) => theme.editorDropDownContent ?? "#1e1f24"};

  border: 1px solid ${({ theme }) => theme.editorLineBorder};

  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);

  z-index: 999;
`;

const MenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;

  padding: 10px 12px;
  border-radius: 8px;

  text-align: left;

  font-size: 13px;
  font-weight: 500;

  color: #ff5c5c;

  cursor: pointer;

  transition: background 0.18s ease;

  &:hover {
    background: rgba(255, 92, 92, 0.12);
  }
`;

const DeleteOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
`;

const DeleteModal = styled.div`
  width: 340px;
  padding: 22px;

  border-radius: 16px;

  background: ${({ theme }) => theme.editorDropDownContent ?? "#1e1f24"};

  border: 1px solid ${({ theme }) => theme.editorLineBorder};

  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
`;

const DeleteTitle = styled.h3`
  margin: 0 0 10px;

  font-size: 18px;
  font-weight: 700;

  color: ${({ theme }) => theme.primaryText};
`;

const DeleteText = styled.p`
  margin: 0;

  font-size: 14px;
  line-height: 1.5;

  color: ${({ theme }) => theme.editorFileUpload};
`;

const DeleteActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 22px;
`;

const CancelBtn = styled.button`
  border: none;
  padding: 10px 16px;

  border-radius: 10px;

  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  background: rgba(255, 255, 255, 0.08);

  color: ${({ theme }) => theme.primaryText};

  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;

const DeleteBtn = styled.button`
  border: none;
  padding: 10px 16px;

  border-radius: 10px;

  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  background: #ff4d4f;
  color: white;

  transition: 0.2s ease;

  &:hover {
    background: #ff2f32;
  }
`;

const PanelLoaderWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.primaryBackground};
`;

const PanelSpinner = styled.div`
  width: 38px;
  height: 38px;

  border-radius: 50%;

  border: 3px solid rgba(120, 120, 120, 0.2);
  border-top-color: ${({ theme }) => theme.activeMenu};

  animation: ${rotate} 0.8s linear infinite;
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
  color: #fff;
  background: rgba(0,0,0,0.6);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
`;