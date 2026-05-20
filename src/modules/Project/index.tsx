/* eslint-disable prettier/prettier */
import withPrivateRoute from "../../hocs/withPrivateRoute";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import LeftPanelSide from "./components/LeftPanel";
import RightPanelSide from "./components/RightPanel";
import HeaderActions from "./components/HeaderActions";
import LeftSideProfileSection from "./components/LeftSideProfileSection";
import { useEffect, useState } from "react";
import { response } from "./data";

const Project = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState({});
  const [slides, setSlides] = useState([]);
  const [currentSlides, setCurrentSlides] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");  

  useEffect(() => {
    if (!projectId) return;

    // Find project by projectId
    const selectedProject = response.find((p) => p.projectId === Number(projectId));

    if (selectedProject) {
      setProjectData(selectedProject);

      // Set slides
      const projectSlides: any = selectedProject?.slides || [];
      setSlides(projectSlides);

      // Set first current slide
      setCurrentSlides(projectSlides[projectSlides.length - 1] || {});
    }
  }, [projectId]);

  console.log("SlideData: ", slides);
  console.log("currebtSlides: ", currentSlides);
  console.log("projectData: ", projectData);

  return (
    <Wrapper>
      <HeaderActions projectData={projectData} />
      <PageLayout>
        <LeftSideProfileSection />
        <LeftPanelSide
          currentSlides={currentSlides}
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
        />
        <RightPanelSide
          selectedVideo={selectedVideo}
          setCurrentSlides={setCurrentSlides}
          slides={slides}
          currentSlides={currentSlides}
          setSlides={setSlides}
        />
      </PageLayout>
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