/* eslint-disable prettier/prettier */
import styled, { keyframes } from "styled-components";
import ChatInput from "../../../components/ChatInput/ChatInput";
import { useEffect, useRef, useState } from "react";
import { chips, models } from "../data";
import { useParams } from "react-router-dom";

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.4 3.4L4.5 4.5M10.5 10.5L11.6 11.6M3.4 11.6L4.5 10.5M10.5 4.5L11.6 3.4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 1.5L12.5 7L3 12.5V1.5Z" fill="currentColor" />
  </svg>
);

const VideoThumbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M11 6.2L15 4V12L11 9.8V6.2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const AiAvatarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" rx="8" fill="url(#aigrad)" />
    <path d="M5 8.5L7 10.5L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="aigrad" x1="0" y1="0" x2="16" y2="16">
        <stop stopColor="#0063B4" />
        <stop offset="1" stopColor="#009AF7" />
      </linearGradient>
    </defs>
  </svg>
);

// Chevron icon for toggle
const ChevronRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M5 3L8.5 6.5L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M8 3L4.5 6.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Image expand icon
const ExpandIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M1 4.5V1H4.5M7.5 1H11V4.5M11 7.5V11H7.5M4.5 11H1V7.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface Paragraph {
  text: string;
  Videopath: string;
  imagePaths?: string[]; // ← NEW: optional images attached to prompt
}

const LeftPanelSide = ({ currentSlides, onSettings, onRename, onClose, setSelectedVideo }: any) => {
  const { projectId } = useParams();
  const [prompt, setPrompt] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [lockedVideoIndex, setLockedVideoIndex] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [extraParagraphs, setExtraParagraphs] = useState<Paragraph[]>([]);
  const [videoSectionVisible, setVideoSectionVisible] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [pendingVideo, setPendingVideo] = useState<any>(null);
  const [panelLoading, setPanelLoading] = useState(true);

  const paragraphs: Paragraph[] = [...(currentSlides?.projectParagraphs ?? []), ...extraParagraphs];

  useEffect(() => {
    setLockedVideoIndex(currentSlides?.projectParagraphs?.length - 1);
  }, [currentSlides?.slideId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [paragraphs, isTyping]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    console.log("Prompt:", prompt);
    console.log("Files:", attachedFiles);
    console.log("selectedModel:", selectedModel);
    console.log("chips:", chips);
    console.log("currebtSlidesId: ", currentSlides.slideId);
    console.log("projectId: ", projectId);

    const userText = prompt.trim();

    setExtraParagraphs((prev) => [
      ...prev,
      {
        text: userText,
        Videopath: "",
      },
    ]);

    setAttachedFiles([]);
    setPrompt("");
    setSelectedModel(models[0]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setExtraParagraphs((prev) => [...prev, { text: "", Videopath: "" }]);
    }, 1500);
  };

  const handleVideoClick = (index: number) => {
    // setActiveVideoIndex(index === lockedVideoIndex ? null : index);
  };

  const handleLockVideo = (index: number, videoPath: string) => {
    setLockedVideoIndex(index);
    console.log("Locked Video Index:", index);
    console.log("Locked Video Path:", videoPath);
  };

  const videoParagraphs = paragraphs.filter((p) => p.Videopath);

  if (!currentSlides) return null;

  const handleConfirmLock = () => {
    if (!pendingVideo) return;

    handleVideoClick(pendingVideo.idx);

    handleLockVideo(pendingVideo.idx, pendingVideo.path);

    setSelectedVideo(pendingVideo.path);

    setShowLockModal(false);
    setPendingVideo(null);
  };

  const handleCancelLock = () => {
    setShowLockModal(false);
    setPendingVideo(null);
  };

  useEffect(() => {
    setPanelLoading(true);

    const timer = setTimeout(() => {
      setPanelLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentSlides]);

  return (
    <LeftPanel>
      {/* ── Top Header ── */}
      <LeftHeader>
        <HeaderTitle>{currentSlides.slideId}</HeaderTitle>
        <HeaderActions>
          <ActionBtn title="Settings" onClick={onSettings}>
            <SettingsIcon />
          </ActionBtn>
          <ActionBtn title="Close" onClick={onClose}>
            <CloseIcon />
          </ActionBtn>
        </HeaderActions>
      </LeftHeader>

      <PanelBody>
        <ChatSection>
          {panelLoading ? (
            <PanelLoaderWrapper>
              <PanelSpinner />
            </PanelLoaderWrapper>
          ) : (
            <>
              {/* ── Chat Column ── */}
              <ChatColumn>
                <PanelHeader>
                  <SectionLabel>Conversation</SectionLabel>
                </PanelHeader>

                <ChatMessages>
                  {paragraphs.length === 0 && (
                    <EmptyState>No conversation yet. Type a prompt below to get started.</EmptyState>
                  )}

                  {paragraphs.map((para, idx) => (
                    <ConversationPair key={`${currentSlides.id}-${idx}`}>
                      {/* User bubble */}
                      {para.text || (para.imagePaths && para.imagePaths.length > 0) ? (
                        <MessageRow $role="user">
                          <MessageBubble $role="user">
                            {/* Attached images grid */}
                            {para.imagePaths && para.imagePaths.length > 0 && (
                              <ImageGrid $count={para.imagePaths.length}>
                                {para.imagePaths.map((src, imgIdx) => (
                                  <ImageThumbWrapper key={imgIdx} onClick={() => setExpandedImage(src)}>
                                    <ImageThumb src={src} alt={`attachment-${imgIdx + 1}`} />
                                    <ImageOverlay>
                                      <ExpandIcon />
                                    </ImageOverlay>
                                  </ImageThumbWrapper>
                                ))}
                              </ImageGrid>
                            )}
                            {para.text ? <BubbleText>{para.text}</BubbleText> : null}
                            <Timestamp>
                              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Timestamp>
                          </MessageBubble>
                        </MessageRow>
                      ) : null}

                      {/* AI bubble */}
                      {/* {para.Videopath ? (
                    <MessageRow $role="ai">
                      <MessageBubble $role="ai">
                        <LinkedVideoCard $active={lockedVideoIndex === idx} onClick={() => handleLockVideo(idx, para.Videopath)}>
                          <LinkedVideoInfo>
                            <LinkedVideoMeta>
                              <StatusDot $status="done" />
                              Ready · {para.Videopath.split("/").pop()}
                            </LinkedVideoMeta>
                          </LinkedVideoInfo>
                        </LinkedVideoCard>

                        <Timestamp>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Timestamp>
                      </MessageBubble>
                    </MessageRow>
                  ) : null} */}
                      {para.Videopath ? (
                        <MessageRow $role="ai">
                          <MessageBubble $role="ai">
                            <VideoContainer
                              $active={lockedVideoIndex === idx}
                              onClick={() => handleLockVideo(idx, para.Videopath)}
                            >
                              <video src={para.Videopath} controls autoPlay={false} preload="metadata" />
                            </VideoContainer>

                            <Timestamp>
                              {new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Timestamp>
                          </MessageBubble>
                        </MessageRow>
                      ) : null}
                    </ConversationPair>
                  ))}

                  {isTyping && (
                    <MessageRow $role="ai">
                      <Avatar>
                        <AiAvatarIcon />
                      </Avatar>
                      <MessageBubble $role="ai">
                        <TypingDots>
                          <Dot $delay="0s" />
                          <Dot $delay="0.18s" />
                          <Dot $delay="0.36s" />
                        </TypingDots>
                      </MessageBubble>
                    </MessageRow>
                  )}

                  <div ref={chatEndRef} />
                </ChatMessages>
              </ChatColumn>
            </>
          )}

          {/* ── Videos Column ── */}
          <VideoSection $visible={videoSectionVisible}>
            <PanelHeader>
              <SectionLabel>
                <VideoThumbIcon />
                Videos ({videoParagraphs.length})
              </SectionLabel>
              <VideoHeaderActions>
                <ActionBtn
                  title={videoSectionVisible ? "Hide Videos" : "Show Videos"}
                  onClick={() => setVideoSectionVisible((v) => !v)}
                >
                  {videoSectionVisible ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </ActionBtn>
                <ActionBtn title="Close Videos" onClick={() => setVideoSectionVisible(false)}>
                  <CloseIcon />
                </ActionBtn>
              </VideoHeaderActions>
            </PanelHeader>

            <VideoList>
              {videoParagraphs.length === 0 && <EmptyState>No videos yet.</EmptyState>}

              {paragraphs.map((para, idx) => {
                if (!para.Videopath) return null;
                return (
                  <VideoCard
                    key={`${currentSlides.id}-vid-${idx}`}
                    $active={lockedVideoIndex === idx}
                    onClick={() => {
                      // handleVideoClick(idx);
                      // handleLockVideo(idx, para.Videopath);
                      // setSelectedVideo(para.Videopath);
                      setPendingVideo({
                        idx,
                        path: para.Videopath,
                      });

                      setShowLockModal(true);
                    }}
                  >
                    <VideoCardIcon>
                      <VideoThumbIcon />
                    </VideoCardIcon>

                    <VideoCardInfo>
                      <VideoCardTitle>Video {idx + 1}</VideoCardTitle>
                      <VideoCardPrompt>{para.text}</VideoCardPrompt>
                      <VideoCardMeta>
                        <StatusPill $status="done">Done</StatusPill>
                        <VideoCardFileName>{para.Videopath.split("/").pop()}</VideoCardFileName>
                      </VideoCardMeta>
                    </VideoCardInfo>
                  </VideoCard>
                );
              })}
            </VideoList>
          </VideoSection>

          {showLockModal && (
            <ModalOverlay>
              <ModalCard>
                <ModalTitle>Lock this video?</ModalTitle>

                <ModalText>
                  This video will be attached to the current slide and won’t be replaced automatically.
                </ModalText>

                <ModalActions>
                  <CancelBtn onClick={handleCancelLock}>Cancel</CancelBtn>

                  <ConfirmBtn onClick={handleConfirmLock}>Lock Video</ConfirmBtn>
                </ModalActions>
              </ModalCard>
            </ModalOverlay>
          )}

          {/* Toggle tab when video section is hidden */}
          {!videoSectionVisible && (
            <>
              {/* Desktop */}
              <VideoToggleTabDesktop onClick={() => setVideoSectionVisible(true)} title="Show Videos">
                <VideoThumbIcon />
                <VideoToggleLabel>Videos</VideoToggleLabel>
              </VideoToggleTabDesktop>
            </>
          )}
        </ChatSection>

        {/* Mobile floating button */}
        {!videoSectionVisible && (
          <FloatingVideoButton onClick={() => setVideoSectionVisible(true)} title="Show Videos">
            <VideoThumbIcon />
            <span>Videos</span>
          </FloatingVideoButton>
        )}

        {/* ── Input ── */}
        <InputArea>
          <ChatInput
            value={prompt}
            width="100%"
            minHeight="40px"
            maxHeight="140px"
            chips={chips}
            attachedFiles={attachedFiles}
            setAttachedFiles={setAttachedFiles}
            onChange={setPrompt}
            onSend={handleSend}
            onSelectModel={setSelectedModel}
            selectedModel={selectedModel}
            models={models}
          />
        </InputArea>
      </PanelBody>

      {/* ── Lightbox ── */}
      {expandedImage && (
        <Lightbox onClick={() => setExpandedImage(null)}>
          <LightboxImage src={expandedImage} alt="expanded" onClick={(e) => e.stopPropagation()} />
          <LightboxClose onClick={() => setExpandedImage(null)}>
            <CloseIcon />
          </LightboxClose>
        </Lightbox>
      )}
    </LeftPanel>
  );
};

/* ─────────────────────────── Animations ─────────────────────────── */

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(10px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

/* ─────────────────────────── Layout ─────────────────────────── */

const LeftPanel = styled.div`
  flex: 0 0 40%;
  min-width: 320px;
  max-width: 40%;
  display: flex;
  flex-direction: column;
  /* KEY: panel itself never scrolls — children handle their own scroll */

  min-width: 0;
  min-height: 0;

  background-color: ${({ theme }) => theme.primaryBackground};
  border-right: 1px solid ${({ theme }) => theme.editorLineBorder};
  flex-shrink: 0;
  position: relative;

  @media (max-width: 1024px) {
    min-width: 280px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    min-width: 0;

    flex: none;
    height: auto;

    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.editorLineBorder};
    overflow: visible;
  }
`;

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 13px;
  border-bottom: 1px solid ${({ theme }) => theme.editorLineBorder};
  flex-shrink: 0;
  gap: 10px;
`;

const HeaderTitle = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText};
  flex: 1;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const VideoHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.55;
  transition: opacity 0.15s, background 0.15s;

  &:hover {
    opacity: 1;
    background: rgba(128, 128, 128, 0.1);
  }
`;

/* PanelBody fills remaining height, never overflows */
const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const ChatSection = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
`;

/* ── Chat column takes remaining width ── */
const ChatColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  min-height: 50px;
  max-height: 50px;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.editorLineBorder};
  flex-shrink: 0;
  background: ${({ theme }) => theme.primaryBackground};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.editorFileUpload};
`;

/* Scrollable chat — occupies all remaining space in ChatColumn */
const ChatMessages = styled.div`
  flex: 1;
  min-height: 0;
  height: 100%;

  overflow-y: auto;
  overflow-x: hidden;

  padding: 12px 14px 8px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.editorLineBorder};
    border-radius: 20px;
  }
`;

const ConversationPair = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeIn} 0.22s ease;
`;

const EmptyState = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  color: ${({ theme }) => theme.editorFileUpload};
  opacity: 0.6;
  text-align: center;
  padding: 20px 12px;
  line-height: 1.5;
`;

const MessageRow = styled.div<{ $role: "user" | "ai" }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-direction: ${({ $role }) => ($role === "user" ? "row-reverse" : "row")};
`;

const Avatar = styled.div`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  margin-bottom: 2px;
`;

const MessageBubble = styled.div<{ $role: "user" | "ai" }>`
  max-width: 60%;
  padding: 9px 12px 6px;
  border-radius: ${({ $role }) => ($role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px")};
  background: ${({ $role, theme }) =>
    $role === "user"
      ? theme.button
      : theme.messageBackground ?? (theme.primaryBackground === "#F0F0F3" ? "#EAEAED" : "#232528")};
  box-shadow: ${({ $role, theme }) => ($role === "user" ? theme.buttonShadow : "none")};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const VideoContainer = styled.div<{ $active: boolean }>`
  width: 100%;
  max-width: 320px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  transition: border-color 0.15s;
  all: unset;
  cursor: pointer;
  background: ${({ theme }) => (theme.primaryBackground === "#F0F0F3" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.25)")};

  video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
  }
`;

const BubbleText = styled.p`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  line-height: 1.55;
  color: ${({ theme }) => theme.primaryText};
  word-break: break-word;
`;

const Timestamp = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 9px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.35;
  align-self: flex-end;
`;

/* ── Image attachments in chat ── */
const ImageGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => ($count === 1 ? "1fr" : $count === 2 ? "1fr 1fr" : "1fr 1fr 1fr")};
  gap: 4px;
  border-radius: 8px;
  overflow: hidden;
  max-width: 220px;
`;

const ImageThumbWrapper = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  aspect-ratio: 1;

  &:hover > div {
    opacity: 1;
  }
`;

const ImageThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s ease;

  ${ImageThumbWrapper}:hover & {
    transform: scale(1.04);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.18s;
  border-radius: 6px;
`;

/* ── Lightbox ── */
const Lightbox = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.18s ease;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  object-fit: contain;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
`;

const LightboxClose = styled.button`
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }
`;

/* ── Typing indicator ── */
const TypingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 2px;
`;

const Dot = styled.span<{ $delay: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.activeMenu};
  animation: ${bounce} 1.2s ease infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

/* ── Input bar ── */
const InputArea = styled.div`
  padding: 10px 12px 12px;
  flex-shrink: 0;
  border-top: 1px solid ${({ theme }) => theme.editorLineBorder};
`;

/* ── Video section (collapsible) ── */
const VideoSection = styled.div<{ $visible: boolean }>`
  flex: 0 0 ${({ $visible }) => ($visible ? "32%" : "0%")};
  display: flex;
  flex-direction: column;

  min-height: 0;
  overflow: hidden;

  border-left: ${({ $visible, theme }) => ($visible ? `1px solid ${theme.editorLineBorder}` : "none")};

  min-width: ${({ $visible }) => ($visible ? "180px" : "0")};

  transition: flex 0.22s ease, min-width 0.22s ease;

  @media (max-width: 768px) {
    width: 100%;
    flex: none;

    height: ${({ $visible }) => ($visible ? "260px" : "0")};
    min-width: 100%;

    border-left: none;
    border-top: ${({ $visible, theme }) => ($visible ? `1px solid ${theme.editorLineBorder}` : "none")};

    transition: height 0.22s ease;
  }
`;

/* Scrollable video list */
const VideoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-height: 0; /* ← critical */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 10px 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.editorLineBorder};
    border-radius: 4px;
  }
`;

/* Slim tab shown when video section is hidden */
const VideoToggleTab = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 28px;
  flex-shrink: 0;
  border-left: 1px solid ${({ theme }) => theme.editorLineBorder};
  background: transparent;
  color: ${({ theme }) => theme.editorFileUpload};
  opacity: 0.7;
  transition: opacity 0.15s, background 0.15s;
  padding: 12px 0;

  &:hover {
    opacity: 1;
    background: rgba(128, 128, 128, 0.06);
  }
`;

const VideoCard = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.activeMenu : theme.editorLineBorder)};
  background: ${({ $active, theme }) =>
    $active
      ? theme.primaryBackground === "#F0F0F3"
        ? "rgba(0,154,247,0.06)"
        : "rgba(0,154,247,0.08)"
      : "transparent"};
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.activeMenu};
  }
`;

const VideoCardIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ theme }) =>
    theme.primaryBackground === "#F0F0F3" ? "rgba(0,154,247,0.08)" : "rgba(0,154,247,0.12)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.activeMenu};
  flex-shrink: 0;
`;

const VideoCardInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const VideoCardTitle = styled.p`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.primaryText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VideoCardPrompt = styled.p`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 9.5px;
  color: ${({ theme }) => theme.editorFileUpload};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
`;

const VideoCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
`;

const StatusPill = styled.span<{ $status: string }>`
  font-family: "Montserrat", sans-serif;
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 20px;
  background: ${({ $status }) =>
    $status === "done"
      ? "rgba(49,223,202,0.15)"
      : $status === "generating"
      ? "rgba(255,140,0,0.15)"
      : "rgba(255,108,118,0.15)"};
  color: ${({ $status }) => ($status === "done" ? "#31DFCA" : $status === "generating" ? "#FF8C00" : "#FF6C76")};
`;

const VideoCardFileName = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 9px;
  color: ${({ theme }) => theme.editorFileUpload};
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: 360px;
  padding: 20px;
  border-radius: 16px;
  background: ${({ theme }) => theme.primaryBackground};
  border: 1px solid ${({ theme }) => theme.editorLineBorder};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
`;

const ModalTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.primaryText};
  font-family: "Montserrat", sans-serif;
`;

const ModalText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.editorFileUpload};
  font-family: "Montserrat", sans-serif;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
`;

const ModalButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  transition: all 0.18s ease;

  &:active {
    transform: scale(0.96);
  }
`;

const CancelBtn = styled(ModalButton)`
  background: ${({ theme }) => theme.editorDropDownContent};
  color: ${({ theme }) => theme.primaryText};

  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmBtn = styled(ModalButton)`
  background: ${({ theme }) => theme.activeMenu};
  color: white;

  &:hover {
    transform: translateY(-1px);
  }
`;

const VideoToggleTabDesktop = styled.button`
  all: unset;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 6px;

  width: 28px;
  flex-shrink: 0;

  border-left: 1px solid ${({ theme }) => theme.editorLineBorder};

  background: transparent;

  color: ${({ theme }) => theme.editorFileUpload};

  opacity: 0.7;

  transition: opacity 0.15s, background 0.15s;

  padding: 12px 0;

  &:hover {
    opacity: 1;
    background: rgba(128, 128, 128, 0.06);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const VideoToggleLabel = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;

  writing-mode: vertical-rl;
  transform: rotate(180deg);
`;

const FloatingVideoButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    all: unset;

    position: fixed;
    right: 14px;
    bottom: 90px;
    z-index: 9999;

    display: flex;
    align-items: center;
    gap: 8px;

    padding: 10px 14px;
    border-radius: 999px;

    cursor: pointer;

    background: ${({ theme }) =>
      theme.primaryBackground === "#F0F0F3" ? "rgba(255,255,255,0.95)" : "rgba(24,24,28,0.95)"};

    border: 1px solid ${({ theme }) => theme.editorLineBorder};

    color: ${({ theme }) => theme.primaryText};

    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);

    backdrop-filter: blur(10px);
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
export default LeftPanelSide;
