/* eslint-disable prettier/prettier */
import withPrivateRoute from "../../hocs/withPrivateRoute";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import LeftPanelSide from "./components/LeftPanel";
import RightPanelSide from "./components/RightPanel";
import HeaderActions from "./components/HeaderActions";
import LeftSideProfileSection from "./components/LeftSideProfileSection";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProject, getProjectLoading } from "../../redux/reducers/projectReducer";
import { getVideoByProjectIdServer } from "../../redux/actions/projectAction";
import CircularProgress from "../../components/Icons/CircularProgress";

const Project = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();

  const projectData = useSelector(getProject);
  const [slides, setSlides] = useState<any[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);
  const isLoading = useSelector(getProjectLoading);

  useEffect(() => {
    if (projectId) {
      dispatch(
        getVideoByProjectIdServer(
          Number(projectId)
        )
      );
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectData) return;

    const projectSlides: any[] = projectData?.slides || [];
    setSlides(projectSlides);

    setSelectedSlide((prev: any) => {
      if (prev?.slideId) {
        const updatedCurrentSlide = projectSlides.find((slide: any) => slide.slideId === prev.slideId);
        return updatedCurrentSlide || projectSlides[projectSlides.length - 1] || projectSlides[0] || null;
      }

      return projectSlides[projectSlides.length - 1] || projectSlides[0] || null;
    });
  }, [projectData]);

  return (
    <Wrapper>
      {isLoading ? (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      ) : (
        <>
          <HeaderActions />
          <PageLayout>
            <LeftSideProfileSection />
            <LeftPanelSide
              // isDraftSlide={isDraftslide}
              // setIsDraftSlide={setIsDraftSlide}
            />
            <RightPanelSide
              // isDraftSlide={isDraftslide}
              // setIsDraftSlide={setIsDraftSlide}
            // currentSlides={currentSlides}
            // setCurrentSlides={setCurrentSlides}
            // slides={slides}
            // setSlides={setSlides}
            />
          </PageLayout>
        </>
      )}
    </Wrapper>
  );
};

export default withPrivateRoute(Project);

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ theme }) => theme.primaryBackground};
`;

const PageLayout = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;

  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;