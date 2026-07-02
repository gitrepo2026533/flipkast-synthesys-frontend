/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import AvatarSelectorModal from "../../../components/AvatarSelectorModal/AvatarSelectorModal";
import BackgroundSelectorModal from "../../../components/BackgroundSelectorModal/BackgroundSelectorModal";
import ChatInput from "../../../components/ChatInput/ChatInput";
import { AiAvatarIcon } from "../../../components/Icons/AiAvatarIcon";
import CloseIcon from "../../../components/Icons/CloseIcon";
import { ExpandIcon } from "../../../components/Icons/ExpandIcon";
import { ImageIcon, ProfileIcon } from "../../../components/Icons/Icons";
import { VideoThumbIcon } from "../../../components/Icons/VideoThumbIcon";
import PopupModel from "../../../components/PopupModel/PopupModel";
import { sidebar } from "../../../mocks/humans";
import { getProjectSlideServer, lockVideoProjectServer, ProjectType, updateVideoProjectServer } from "../../../redux/actions/projectAction";
import { getDraftSlideData, getIsDraftSlide, getProject } from "../../../redux/reducers/projectReducer";
import { IHuman, ProfileHumanSidebarType } from "../../../types/human";
import { chips, models } from "../data";
import { getActorsList } from "../../../redux/reducers/actorReducer";
import { getActorsServer } from "../../../redux/actions/actorActions";
import { getFullImageUrl } from "../../../lib/getFullImageUrl";
import { getAllUserAssetsServer } from "../../../redux/actions/profileActions";
import { getUserAssets } from "../../../redux/reducers/profileReducer";

interface Paragraph {
  projectParagraphId: number;
  text: string;
  outputAudio: string;
  imagePaths?: string[];
  errorMessage?: string;
  outputVideo?: string;
}

interface LeftPanelProps {
  currentSlideId?: number | null;
}

const LeftPanelSide = ({ currentSlideId }: LeftPanelProps) => {
  const { projectId } = useParams();
  const [prompt, setPrompt] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [videoSectionVisible, setVideoSectionVisible] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [pendingVideo, setPendingVideo] = useState<any>(null);
  const dispatch = useDispatch();
  const projectData = useSelector(getProject);
  const [slideData, setSlideData] = useState<any>({});
  const isDraftSlide = useSelector(getIsDraftSlide);
  const draftSlideData = useSelector(getDraftSlideData);

  const isAvatarProject = projectData?.projectTypeId === ProjectType.AVT;
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<IHuman | null>(null);
  const [showBgModal, setShowBgModal] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  const paragraphs: Paragraph[] = slideData?.projectParagraphs;

  const actorsList = useSelector(getActorsList);

  useEffect(() => {
    dispatch(getActorsServer({ pageNumber: 1 }));
    dispatch(getAllUserAssetsServer({
      pageNumber: 1, pageSize: 60, assetTypeId: 11,
      sortWith: "insertDateTime",
      sortByDesc: true,
    }));
  }, [dispatch]);

  const avatarData = actorsList?.map((actor) => ({
    id: actor.actorId,
    image: getFullImageUrl(actor.photo),
  }));

  const userAssets = useSelector(getUserAssets);
  const backgroundData = useMemo(() => {
    const assets = userAssets?.map((asset: any) => ({
      id: asset.userAssetID,
      image: asset.path,
    })) || [];

    const mockBgData = sidebar.find((s) => s.type === ProfileHumanSidebarType.Background)?.data || [];
    return mockBgData.map((category: any) => {
        return {
          ...category,
          data: assets,
        };
    });
  }, [userAssets]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    if (isAvatarProject && (!selectedAvatar || !selectedBackground)) {
      toast.error("Please select both an Avatar and a Background before generating.");
      return;
    }
    let bgId: string | number | undefined = isAvatarProject ? selectedBackground! : undefined;
    if (isAvatarProject && backgroundData && selectedBackground) {
      backgroundData.forEach((category: any) => {
        if (category.data) {
          const match = category.data.find((b: any) => b.image === selectedBackground || b.video === selectedBackground);
          if (match) bgId = match.id;
        }
      });
    }

    setAttachedFiles([]);
    setPrompt("");
    setSelectedModel(models[0]);
    setIsTyping(true);
    try {
      await dispatch(
        updateVideoProjectServer({
          title: projectData?.title,
          projectId: Number(projectId),
          slides: [
            {
              slideId: slideData.slideId,
              order: slideData.order,
              slideBackgroundColor: isAvatarProject ? selectedBackground! : slideData.slideBackgroundColor,
              backgroundId: bgId,
              projectParagraphs: [
                {
                  projectParagraphId: 0,
                  order: 1,
                  actorId: isAvatarProject ? selectedAvatar!.id : 12270,
                  text: prompt.trim(),
                },
              ],
            },
          ],
        })
      );
    } finally {
      setIsTyping(false);
    }
    
    if (isAvatarProject) {
      setSelectedAvatar(null);
      setSelectedBackground(null);
      setPreviewChips([]);
    }
    // dispatch(getProjectSlideServer(Number(projectId), Number(slideData.slideId)));
  };

  const videoParagraphs = paragraphs?.filter(
    (p) => p.outputAudio != null
  );

  if (!slideData) return null;

  const handleConfirmLock = () => {
    if (!pendingVideo) return;
    dispatch(lockVideoProjectServer({
      projectId: Number(projectId),
      slideId: Number(slideData.slideId),
      ParagraphId: Number(pendingVideo?.paragraphId),
    }));
    dispatch(getProjectSlideServer(Number(projectId), Number(slideData.slideId),
    ));
    setShowLockModal(false);
    setPendingVideo(null);
  };

  const handleCancelLock = () => {
    setShowLockModal(false);
    setPendingVideo(null);
  };

  useEffect(() => {
    if (!projectData) return;

    if (isDraftSlide && draftSlideData?.slideId === 0) {
      setSlideData(draftSlideData);
    } else {
      const targetId = currentSlideId || projectData.slides?.[0]?.slideId;
      const activeSlide = projectData.slides?.find((s: any) => s.slideId === targetId);
      
      if (activeSlide) {
        setSlideData(activeSlide);
      } else if (projectData?.slides?.length) {
        setSlideData(projectData.slides[0]);
      }
    }
  }, [projectData, draftSlideData, isDraftSlide, currentSlideId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [paragraphs, isTyping]);

  const openAvatarSelector = () => {
    setShowAvatarModal(true);
  };

  const extraLeftActions = isAvatarProject ? (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      <ToolbarActions>
        <ToolbarButton onClick={openAvatarSelector} title="Select Avatar">
          <ProfileIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => setShowBgModal(true)} title="Select Background">
          <ImageIcon />
        </ToolbarButton>
      </ToolbarActions>
    </div>
  ) : null;

  const [previewChips, setPreviewChips] = useState<Array<{ label: string; title: string; image: any; onRemove: () => void }>>([]);

  return (
    <LeftPanel>
      {/* ── Top Header ── */}
      <LeftHeader>
        <HeaderTitle>{slideData.slideId}</HeaderTitle>
        {/* <HeaderActions>
        </HeaderActions> */}
        <SlideStatusBadge $active={slideData?.isActive}>
          {slideData.slideId === 0 ? "Draft" : slideData?.isActive ? "Active" : "Inactive"}
        </SlideStatusBadge>
      </LeftHeader>

      <PanelBody>
        <ChatSection>
          <ChatColumn>
            <PanelHeader>
              <SectionLabel>Conversation</SectionLabel>
            </PanelHeader>

            <ChatMessages>
              {paragraphs?.length === 0 ? (
                <EmptyState>No conversation yet. Type a prompt below to get started.</EmptyState>
              ) : (
                paragraphs?.map((para, idx) => (
                  <ConversationPair key={`${slideData.id}-${idx}`}>
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
                    {para.outputAudio ? (
                      <MessageRow $role="ai">
                        <MessageBubble $role="ai">
                          <VideoContainer
                            $active={
                              para?.projectParagraphId === slideData?.projectParagraphId
                            }
                          >
                            <video
                              src={`http://192.168.1.80:7132/${para.outputAudio}`}
                              controls
                              autoPlay={false}
                              preload="metadata"
                            />
                          </VideoContainer>

                          <Timestamp>
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Timestamp>
                        </MessageBubble>
                      </MessageRow>
                    ) : (
                      <ErrorContainer>
                        <ErrorTitle>
                          ⚠️ AI Generation Failed
                        </ErrorTitle>

                        <ErrorMessage> {para?.errorMessage}
                        </ErrorMessage>
                      </ErrorContainer>
                    )}
                  </ConversationPair>
                ))
              )}

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

          <VideoSection $visible={videoSectionVisible}>
            <PanelHeader>
              <SectionLabel>
                <VideoThumbIcon />
                Videos ({videoParagraphs?.length})
              </SectionLabel>
              <VideoHeaderActions>
                <ActionBtn title="Close Videos" onClick={() => setVideoSectionVisible(false)}>
                  <CloseIcon />
                </ActionBtn>
              </VideoHeaderActions>
            </PanelHeader>

            <VideoList>
              {videoParagraphs?.length === 0 ? (
                <EmptyState>No videos generated yet. Send a prompt to create videos.</EmptyState>
              ) : (
                videoParagraphs?.map((para, idx) => {
                  return (
                    <VideoCard
                      key={`${slideData.id}-vid-${idx}`}
                      $active={para?.projectParagraphId === slideData?.projectParagraphId}
                      onClick={() => {
                        setPendingVideo({
                          paragraphId: para.projectParagraphId,
                          path: para.outputAudio,
                        });
                        setShowLockModal(true);
                      }}
                    >
                      <VideoPreview
                        src={`http://192.168.1.80:7132/${para.outputAudio}`}
                        muted
                        preload="metadata"
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />

                      <VideoOverlay>
                        <VideoCardTitle>Video {idx + 1}</VideoCardTitle>
                      </VideoOverlay>
                    </VideoCard>
                  );
                })
              )}
            </VideoList>
          </VideoSection>

          {/* {showLockModal && (
            <ModalOverlay>
              <ModalCard>
                <ModalTitle>
                  {Number(projectData?.status) === 2
                    ? "Stop current generation?"
                    : Number(projectData?.status) === 3
                      ? "Discard preview changes?"
                      : "Lock this video?"}
                </ModalTitle>

                <ModalText>
                  {Number(projectData?.status) === 2
                    ? "A video generation process is currently running. Locking this video will stop the current generation process and attach this selected video to the slide. Do you want to continue?"
                    : Number(projectData?.status) === 3
                      ? "The current preview changes will be discarded and this selected video will be attached to the slide. Do you want to continue?"
                      : "This video will be attached to the current slide and won’t be replaced automatically."}
                </ModalText>

                <ModalActions>
                  <CancelBtn onClick={handleCancelLock}>Cancel</CancelBtn>

                  <ConfirmBtn onClick={handleConfirmLock}>
                    {Number(projectData?.status) === 2
                      ? "Stop & Lock Video"
                      : Number(projectData?.status) === 3
                        ? "Discard & Lock Video"
                        : "Lock Video"}
                  </ConfirmBtn>
                </ModalActions>
              </ModalCard>
            </ModalOverlay>
          )} */}

          <PopupModel
            open={showLockModal}
            title={Number(projectData?.status) === 2
              ? "Stop current generation?"
              : Number(projectData?.status) === 3
                ? "Discard preview changes?"
                : "Lock this video?"}
            description={Number(projectData?.status) === 2
              ? "A video generation process is currently running. Locking this video will stop the current generation process and attach this selected video to the slide. Do you want to continue?"
              : Number(projectData?.status) === 3
                ? "The current preview changes will be discarded and this selected video will be attached to the slide. Do you want to continue?"
                : "This video will be attached to the current slide and won’t be replaced automatically."}
            confirmText={Number(projectData?.status) === 2
              ? "Stop & Lock Video"
              : Number(projectData?.status) === 3
                ? "Discard & Lock Video"
                : "Lock Video"}
            cancelText="Cancel"
            onClose={handleCancelLock}
            onConfirm={handleConfirmLock}
          />

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
            extraLeftActions={extraLeftActions}
            previewChips={previewChips}
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

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        open={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        avatarData={avatarData}
        selectedAvatarId={selectedAvatar?.id}
        onSelect={(avatar) => {
          setSelectedAvatar(avatar);
          setPreviewChips(prev => {
            const filtered = prev.filter(c => c.label !== "Avatar");
            return [
              ...filtered,
              {
                label: "Avatar",
                title: `Avatar ${avatar.id}`,
                image: avatar.imageSrc || "https://picsum.photos/100",
                onRemove: () => {
                  setSelectedAvatar(null);
                  setPreviewChips(prev => prev.filter(c => c.label !== "Avatar"));
                }
              },
            ];
          });
          setShowAvatarModal(false);
        }}
      />

      {/* Background Selector Modal */}
      <BackgroundSelectorModal
        open={showBgModal}
        onClose={() => setShowBgModal(false)}
        backgroundData={backgroundData}
        onSelect={(src) => {
          setSelectedBackground(src);
          setPreviewChips(prev => {
            const filtered = prev.filter(c => c.label !== "Background");
            return [
              ...filtered,
              {
                label: "Background",
                title: "Selected BG",
                image: src,
                onRemove: () => {
                  setSelectedBackground(null);
                  setPreviewChips(prev => prev.filter(c => c.label !== "Background"));
                },
              },
            ];
          });
          setShowBgModal(false);
        }}
      />
    </LeftPanel>
  );
};

// Style

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

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
  border-right: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
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
    border-bottom: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
    overflow: visible;
  }
`;

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 13px;
  border-bottom: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
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
  border-bottom: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
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
    background: ${({ theme }) => theme.chatTextfieldBorder};
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
  background: ${({ $role, theme }) => theme.messageBackground};
  // box-shadow: ${({ $role, theme }) => ($role === "user" ? theme.buttonShadow : "none")};
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
  color: ${({ theme }) => theme.chatText};
  word-break: break-word;
`;

const Timestamp = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 9px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.35;
  align-self: flex-end;
`;

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

const InputArea = styled.div`
  padding: 10px 12px 12px;
  flex-shrink: 0;
  border-top: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
`;

const VideoSection = styled.div<{ $visible: boolean }>`
  flex: 0 0 ${({ $visible }) => ($visible ? "32%" : "0%")};
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border-left: ${({ $visible, theme }) => ($visible ? `1px solid ${theme.chatTextfieldBorder}` : "none")};
  min-width: ${({ $visible }) => ($visible ? "180px" : "0")};
  transition: flex 0.22s ease, min-width 0.22s ease;

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    height: ${({ $visible }) => ($visible ? "260px" : "0")};
    min-width: 100%;
    border-left: none;
    border-top: ${({ $visible, theme }) => ($visible ? `1px solid ${theme.chatTextfieldBorder}` : "none")};
    transition: height 0.22s ease;
  }
`;

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
    background: ${({ theme }) => theme.chatTextfieldBorder};
    border-radius: 4px;
  }
`;

const VideoCard = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 110px;
  border-radius: 14px;
  border: 2px solid
    ${({ $active, theme }) =>
    $active ? theme.activeMenu : "transparent"};
  background: #000;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
  background: #000;
`;

const VideoOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
  display: flex;
  align-items: flex-end;
`;

const VideoCardTitle = styled.p`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
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
  border: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
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

const ErrorContainer = styled.div`
  padding: 12px;
  border-radius: 12px;
  background: #2a1f1f;
  border: 1px solid #ff4d4f;
  color: #ff6b6b;
  min-width: 260px;
`;

const ErrorTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.5;
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
  border-left: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
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
    border: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
    color: ${({ theme }) => theme.primaryText};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(10px);
  }
`;

const SlideStatusBadge = styled.div<{ $active?: boolean }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  background: ${({ $active }) =>
    $active
      ? "rgba(52, 199, 89, 0.12)"
      : "rgba(255, 77, 79, 0.12)"};

  color: ${({ $active }) =>
    $active ? "#34C759" : "#FF4D4F"};

  border: 1px solid
    ${({ $active }) =>
    $active
      ? "rgba(52, 199, 89, 0.3)"
      : "rgba(255, 77, 79, 0.3)"};
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ToolbarButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
  background: ${({ theme }) => theme.editorDropDownContent};
  color: ${({ theme }) => theme.editorFileUpload};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background: ${({ theme }) => theme.menuListItemActive};
    color: ${({ theme }) => theme.primaryText};
    transform: translateY(-1px);
  }
`;

export default LeftPanelSide;
