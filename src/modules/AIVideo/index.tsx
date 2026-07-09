/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatInput from "../../components/ChatInput/ChatInput";
import CircularProgress from "../../components/Icons/CircularProgress";
import { SearchIcon } from "../../components/Icons/SearchIcon";
import Textfield from "../../components/Textfield/Textfield";
import withPrivateRoute from "../../hocs/withPrivateRoute";
import SidebarLayout from "../../layouts/SidebarLayout";
import { createVideoProjectServer, getVideoProjectServer, resetCreatedProject } from "../../redux/actions/projectAction";
import { createProjectLoading, getCreatedProject, getVideoProjectList, getVideoProjectListLoading, getVideoTotalPages } from "../../redux/reducers/projectReducer";
import VideoProjectCard from "./components/VideoProjectCard";
import { chips, models } from "./data";

const AiVideo = () => {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] =
    useState(models[0]);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [projectTypeId, setProjectTypeId] = useState(2)
  const [status, setStatus] = useState(null)
  const [sortWith, setSortWith] = useState("updateDateTime")
  const [sortByDesc, setSortByDesc] = useState(true)
  const videoProjects = useSelector(getVideoProjectList)
  const isCreatingProject = useSelector(createProjectLoading)
  const createdProject = useSelector(getCreatedProject)
  const projectListLoading = useSelector(getVideoProjectListLoading)
  const totalPages = useSelector(getVideoTotalPages)
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  const handleSend = () => {
    if (prompt.trim() === "") return;
    dispatch(createVideoProjectServer({
      prompt: prompt
    }))
  }

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
  }, [createdProject])

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
      // fresh load or search
      if (projectListLoading) {
        setProjectsData([]);
      } else {
        setProjectsData(videoProjects);
      }
    } else {
      // pagination
      // Only append if not loading, to avoid appending same items twice
      if (!projectListLoading) {
         setProjectsData((prev: any) => {
            // Prevent duplicate appending by checking if we already have these items
            const newItems = videoProjects.filter((vp: any) => !prev.find((p: any) => p.projectId === vp.projectId));
            return [...prev, ...newItems];
         });
      }
    }
  }, [videoProjects, projectListLoading, pageNumber]);

  return (
    <Wrapper>
      <SidebarLayout>
          <Content>
            <Container>
              <HeroSection>
                <HeroText>
                  <PageTitle>Generate AI Videos</PageTitle>
                  <PageSubtitle>from Prompt</PageSubtitle>
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
                  {projectsData.map((project) => (
                    <VideoProjectCard
                      key={project.projectId}
                      title={project.title}
                      image={project.coverImage ? `${process.env.REACT_APP_MEDIA_BASE_URL}${project.coverImage}` : "https://picsum.photos/536/354"}
                      preViewVideo={project?.output}
                      onClick={() => navigate(`/ai-video/projects/${project.projectId}`)}
                    />
                  ))}
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
    </Wrapper>
  );
};

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
`;

const CreatingProjectWrapper = styled.div`
  display: flex;
  justify-content: center;  
  align-items: center;
  margin-top: 8px;
`;

const CreatingText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.7;
  font-family: "Montserrat", sans-serif;
`;

export default withPrivateRoute(AiVideo);