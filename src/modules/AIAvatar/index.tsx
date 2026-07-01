/* eslint-disable prettier/prettier */
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import AvatarSelectorModal from "../../components/AvatarSelectorModal/AvatarSelectorModal";
import BackgroundSelectorModal from "../../components/BackgroundSelectorModal/BackgroundSelectorModal";
import ChatInput from "../../components/ChatInput/ChatInput";
import CircularProgress from "../../components/Icons/CircularProgress";
import { ImageIcon, ProfileIcon } from "../../components/Icons/Icons";
import { SearchIcon } from "../../components/Icons/SearchIcon";
import Textfield from "../../components/Textfield/Textfield";
import withPrivateRoute from "../../hocs/withPrivateRoute";
import SidebarLayout from "../../layouts/SidebarLayout";
import { BackgroundProps, sidebar } from "../../mocks/humans";
import { StoreType } from "../../types/store";
import { createAvatarProjectServer, getVideoProjectServer, ProjectType, resetCreatedProject } from "../../redux/actions/projectAction";
import { getActorsServer } from "../../redux/actions/actorActions";
import { createProjectLoading, getCreatedProject, getProjectList, getProjectListLoading, getTotalPages } from "../../redux/reducers/projectReducer";
import { getActorsList } from "../../redux/reducers/actorReducer";
import { getAllUserAssetsServer } from "../../redux/actions/profileActions";
import { getUserAssets } from "../../redux/reducers/profileReducer";
import { getFullImageUrl } from "../../lib/getFullImageUrl";
import { IHuman, ProfileHumanSidebarType } from "../../types/human";
import VideoProjectCard from "../AIVideo/components/VideoProjectCard";
import { chips, models } from "../AIVideo/data";

const AiAvatar = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [projectTypeId, setProjectTypeId] = useState(ProjectType.AVT);
  const [status, setStatus] = useState(null);
  const [sortWith, setSortWith] = useState("updateDateTime");
  const [sortByDesc, setSortByDesc] = useState(true);

  const videoProjects = useSelector(getProjectList);
  const isCreatingProject = useSelector(createProjectLoading);
  const createdProject = useSelector(getCreatedProject);
  const projectListLoading = useSelector(getProjectListLoading);
  const totalPages = useSelector(getTotalPages);

  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  const actorsList = useSelector(getActorsList);

  useEffect(() => {
    dispatch(getActorsServer({ pageNumber: 1 }));
    dispatch(getAllUserAssetsServer({
      pageNumber: 1, pageSize: 60, assetTypeId: 11,
      sortWith: "insertDateTime",
      sortByDesc: true,
    }));
  }, [dispatch]);

  // Avatar Selection State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<IHuman | null>(null);
  
  const avatarData = actorsList?.map((actor) => ({
    id: actor.actorId,
    image: getFullImageUrl(actor.photo),
  }));

  // Background Selection State
  const [showBgModal, setShowBgModal] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
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

  const handleSend = () => {
    if (prompt.trim() === "") return;
    if (!selectedAvatar || !selectedBackground) {
      toast.error("Please select both an Avatar and a Background before generating.");
      return;
    }

    let bgId: string | number = selectedBackground;
    backgroundData.forEach((category: any) => {
      if (category.data) {
        const match = category.data.find((b: any) => b.image === selectedBackground || b.video === selectedBackground);
        if (match) bgId = match.id;
      }
    });

    // Include selected avatar and background images in the payload
    dispatch(createAvatarProjectServer({
      script: prompt.trim(),
      avatarImage: selectedAvatar.imageSrc,
      avatarId: selectedAvatar.id,
      backgroundId: bgId,
      backgroundImage: selectedBackground,
    }));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottomReached = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    if (bottomReached && !projectListLoading && pageNumber <= totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    setPageNumber(1);
    setProjectsData([]);
  };

  useEffect(() => {
    if (createdProject?.projectId) {
      navigate(`/ai-video/projects/${createdProject?.projectId}`);
      dispatch(resetCreatedProject());
    }
  }, [createdProject]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    dispatch(getVideoProjectServer({
      pageNumber, pageSize, keyword, projectTypeId, status, sortWith, sortByDesc
    }));
  }, [pageNumber, debouncedKeyword]);

  useEffect(() => {
    if (pageNumber === 1) {
      setProjectsData(videoProjects);
    } else {
      setProjectsData((prev: any) => [...prev, ...videoProjects]);
    }
  }, [videoProjects]);

  const openAvatarSelector = () => {
    setShowAvatarModal(true);
  };

  const openBgSelector = () => {
    setShowBgModal(true);
  };

  const extraLeftActions = (
    <ToolbarActions>
      <ToolbarButton onClick={openAvatarSelector} title="Select Avatar">
        <ProfileIcon />
      </ToolbarButton>
      <ToolbarButton onClick={openBgSelector} title="Select Background">
        <ImageIcon />
      </ToolbarButton>
    </ToolbarActions>
  );

  const previewChips = [];
  if (selectedAvatar) {
    previewChips.push({
      label: "Avatar",
      title: selectedAvatar.name || "Selected Avatar",
      image: selectedAvatar.imageSrc || "https://picsum.photos/100",
      onRemove: () => setSelectedAvatar(null)
    });
  }
  if (selectedBackground) {
    previewChips.push({
      label: "Background",
      title: "Selected BG",
      image: selectedBackground,
      onRemove: () => setSelectedBackground(null)
    });
  }

  return (
    <Wrapper>
      <SidebarLayout>
        <Content>
          <Container>
            <HeroSection>
              <HeroText>
                <PageTitle>Generate AI Avatar Videos</PageTitle>
                <PageSubtitle>from Script</PageSubtitle>
              </HeroText>

              <ChatInput
                value={prompt}
                width="100%"
                minHeight="50px"
                maxHeight="140px"
                chips={chips}
                attachedFiles={attachedFiles}
                setAttachedFiles={setAttachedFiles}
                onChange={setPrompt}
                onSend={handleSend}
                onSelectModel={setSelectedModel}
                selectedModel={selectedModel}
                models={models}
                showLoading={isCreatingProject}
                extraLeftActions={extraLeftActions}
                previewChips={previewChips}
                placeholder="Enter your script here..."
              />
            </HeroSection>

            <ProjectsSection>
              <ProjectsHeader>
                <ProjectsLabel>My Projects</ProjectsLabel>
                <Textfield
                  value={keyword}
                  placeholder="Search for voice actors, languages etc."
                  startAdornment={<SearchIcon />}
                  onChange={handleSearchChange}
                />
              </ProjectsHeader>
              <ProjectsGrid onScroll={handleScroll}>
                {projectsData.length > 0 ? (
                  projectsData.map((project) => (
                    <VideoProjectCard
                      key={project.projectId}
                      title={project.title}
                      image={project.coverImage ? `http://192.168.1.80:7132${project.coverImage}` : "https://picsum.photos/536/354"}
                      preViewVideo={project?.output}
                      onClick={() => navigate(`/ai-video/projects/${project.projectId}`)}
                    />
                  ))
                ) : (
                  !projectListLoading && (
                    <NoProjectsWrapper>
                      <NoProjectsText>No projects yet</NoProjectsText>
                    </NoProjectsWrapper>
                  )
                )}
                {projectListLoading && (
                  <LoadingWrapper>
                    <CircularProgress />
                  </LoadingWrapper>
                )}
              </ProjectsGrid>
            </ProjectsSection>
          </Container>
        </Content>
      </SidebarLayout>

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        open={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        avatarData={avatarData}
        selectedAvatarId={selectedAvatar?.id}
        onSelect={(avatar) => {
          setSelectedAvatar(avatar);
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
          setShowBgModal(false);
        }}
      />
    </Wrapper>
  );
};

export default withPrivateRoute(AiAvatar);

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  flex: 1;
  min-width: 0;
`;

const Container = styled.div`
  padding: 32px 32px 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 20px 16px 16px;
    gap: 24px;
  }
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding-top: 20px;
  @media (max-width: 768px) {
    padding-top: 8px;
    gap: 16px;
  }
`;

const HeroText = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PageTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: clamp(22px, 3vw, 32px);
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.primaryText};
  margin: 0;
`;

const PageSubtitle = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 2vw, 22px);
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
  letter-spacing: -0.3px;
`;

const ProjectsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

const ProjectsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProjectsLabel = styled.p`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(280px, 1fr)
  );
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding-right: 4px;
  padding-bottom: 10px;
  align-content: start;
  width: 100%;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;  
  align-items: center;
  padding: 20px 0;
  grid-column: 1 / -1;
`;

const NoProjectsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  width: 100%;
  grid-column: 1 / -1;
`;

const NoProjectsText = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.5;
  margin: 0;
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

