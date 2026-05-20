import { useEffect, useRef, useState } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import styled from "styled-components";
import { myStudioDropDownItems } from "../../mocks/myStudioDropDownItems";
import MyStudioDropDown from "../../components/MyStudioDropDown/MyStudionDropDown";
import {
  getCurrentPageProjects,
  getHasMoreProjects,
  getProjectList,
  getProjectListLoading,
} from "../../redux/reducers/projectReducer";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProjectListServer } from "../../redux/actions/projectAction";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import CircularProgress from "../../components/Icons/CircularProgress";
import ProjectCardLarge from "../../components/ProjectCard/ProjectCardLarge";
import Select from "../../components/Select/Select";
import Sidebar from "../../components/Sidebar/Sidebar";
import { diffDays } from "../../lib/diffDays";
import InfiniteScroll from "react-infinite-scroll-component";
import withPrivateRoute from "../../hocs/withPrivateRoute";

enum ProjectsDisplayMode {
  aiHuman = "aiHuman",
  aiVoices = "aiVoices",
}

const options = {
  data: [
    {
      id: "1",
      label: "AI Voices",
      value: ProjectsDisplayMode.aiVoices,
    },
    {
      id: "2",
      label: "AI Human",
      value: ProjectsDisplayMode.aiHuman,
    },
  ],
};

const MyStudio = () => {
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);
  const projectList = useSelector(getProjectList);
  const projectLoading = useSelector(getProjectListLoading);
  const hasMore = useSelector(getHasMoreProjects);
  const currentPage = useSelector(getCurrentPageProjects);
  const [currentSelectValue, setCurrentSelectValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<ProjectsDisplayMode>(options.data[0].value);
  const [activeProject, setActiveProject] = useState<number>();

  const onChangeSelect = (newValue: ProjectsDisplayMode) => {
    setSelectedValue(newValue);
  };

  const handleActiveProject = (e: any, id?: number) => {
    e.preventDefault();

    setActiveProject(id);
  };

  const onChangeCurrentValue = (val: string) => {
    setCurrentSelectValue(val);
  };

  const fetchMore = () => {
    dispatch(
      getProjectListServer({
        keyword: "",
        pageNumber: currentPage + 1,
        pageSize: 40,
      }),
    );
  };

  useEffect(() => {
    dispatch(getProjectListServer({ keyword: "", pageNumber: 1, pageSize: 40 }));
  }, []);

  return (
    <Wrapper>
      <SidebarLayout>
        <Content>
          <MobileOnly>
            <MyStudioTitle>My Studio</MyStudioTitle>
          </MobileOnly>
          <div style={{ width: "100%" }}>
            <MobileOnly>
              <Sidebar mobile />
            </MobileOnly>
            <MyStudioTitleAndDropDown>
              <DesktopOnly>
                <MyStudioTitle>My Studio</MyStudioTitle>
              </DesktopOnly>
              <ActionsWrapper>
                <MyStudioDropDown
                  value={currentSelectValue}
                  onChange={(value: string) => onChangeCurrentValue(value)}
                  dropDownList={myStudioDropDownItems}
                  defaultValueText="Sort by"
                />
                <SelectWrapper>
                  <Select value={selectedValue} onChange={onChangeSelect} optionsList={options} defaultValueText="" />
                </SelectWrapper>
              </ActionsWrapper>
            </MyStudioTitleAndDropDown>
          </div>
          {/* {projectLoading ? (
            <Center>
              <CircularProgress color="#009af7" />
            </Center>
          ) : ( */}
          <MyStudioContentWrapper id="scrollableDiv" displayMode={selectedValue}>
            <InfiniteScroll
              next={fetchMore}
              hasMore={hasMore}
              loader={<></>}
              dataLength={projectList?.length}
              style={{ display: "contents" }}
              scrollableTarget="scrollableDiv"
            >
              {projectList &&
                projectList?.map((project) => (
                  <Link key={project.projectId} to={`/actors?projectId=${project.projectId}`}>
                    {selectedValue === ProjectsDisplayMode.aiVoices ? (
                      <ProjectCard
                        project={project}
                        title={project?.title}
                        description={project.subTitle}
                        projectTime={project?.updateDateTime}
                        image={project?.coverImage}
                        active={project.projectId === activeProject}
                        setActiveProject={setActiveProject}
                        handleActiveProject={(e: any) => handleActiveProject(e, project.projectId)}
                      />
                    ) : (
                      <ProjectCardLarge
                        title={project?.title}
                        projectTime={project?.updateDateTime}
                        image={project?.coverImage}
                      />
                    )}
                  </Link>
                ))}
            </InfiniteScroll>
          </MyStudioContentWrapper>
          {/* )} */}
        </Content>
      </SidebarLayout>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  overflow: hidden auto;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1001px) {
    display: flex;

    & > div {
      display: flex;
    }
  }
`;

const DesktopOnly = styled.div`
  flex: 1;

  @media (max-width: 1001px) {
    display: none;
  }
`;

const MyStudioTitleAndDropDown = styled("div")`
  display: flex;
  width: 100%;
  margin-top: 21px;
  align-items: center;

  @media (max-width: 1001px) {
    margin-top: 0;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  column-gap: 24px;
  align-items: center;

  @media (max-width: 1001px) {
    width: 100%;
  }
`;

const MyStudioTitle = styled("h1")`
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -1px;
  color: ${({ theme }: any) => theme.primaryText};
  flex: 1;
`;

const SelectWrapper = styled.div`
  width: 312px;

  @media (max-width: 1001px) {
    flex: 1;
  }
`;

const MyStudioContentWrapper = styled("div")<{ displayMode: ProjectsDisplayMode }>`
  position: relative;
  display: grid;
  align-content: flex-start;
  overflow: hidden auto;
  width: 100%;
  height: 100%;
  max-height: 100%;
  gap: ${({ displayMode }) => (displayMode === ProjectsDisplayMode.aiVoices ? "14px" : "12px")};
  margin-top: 6px;
  padding: 0 4px;

  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  .infinite-scroll-component__outerdiv {
    display: contents;
  }

  @media (max-width: 550px) {
    display: grid;
    justify-content: space-between;
    grid-template-columns: ${({ displayMode }) =>
      displayMode === ProjectsDisplayMode.aiVoices
        ? "repeat(auto-fit, minmax(234px, 1fr))"
        : "repeat(2, minmax(140px, 1fr))"};
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.activeMenu};
  }

  ::-webkit-scrollbar-track {
    margin: 15px 0;
  }
`;

const Center = styled.div`
  margin: auto;
`;

export default withPrivateRoute(MyStudio);
