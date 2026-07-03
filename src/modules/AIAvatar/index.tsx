/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CircularProgress from "../../components/Icons/CircularProgress";
import { SearchIcon } from "../../components/Icons/SearchIcon";
import Textfield from "../../components/Textfield/Textfield";
import Button from "../../components/Button/Button";
import withPrivateRoute from "../../hocs/withPrivateRoute";
import SidebarLayout from "../../layouts/SidebarLayout";
import { getVideoProjectServer, ProjectType } from "../../redux/actions/projectAction";
import { getAvatarProjectList, getAvatarProjectListLoading, getAvatarTotalPages } from "../../redux/reducers/projectReducer";
import VideoProjectCard from "../AIVideo/components/VideoProjectCard";

const AiAvatar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [projectTypeId, setProjectTypeId] = useState(ProjectType.AVT);
  const [status, setStatus] = useState(null);
  const [sortWith, setSortWith] = useState("updateDateTime");
  const [sortByDesc, setSortByDesc] = useState(true);

  const videoProjects = useSelector(getAvatarProjectList);
  const projectListLoading = useSelector(getAvatarProjectListLoading);
  const totalPages = useSelector(getAvatarTotalPages);

  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

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
            <PageHeader>
              <Button
                text="Create AI Avatar Video"
                onClick={() => navigate("/ai-humans")}
                style={{ width: "fit-content", padding: "0 20px" }}
              />
            </PageHeader>
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
                      onClick={() => navigate(`/ai-humans/projects/${project.projectId}`)}
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

const PageHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
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
