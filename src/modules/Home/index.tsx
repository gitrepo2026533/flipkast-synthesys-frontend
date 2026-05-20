import Slider from "react-slick";
import styled from "styled-components";
import { ArrowRight } from "../../components/Icons/ArrowRight";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import SidebarLayout from "../../layouts/SidebarLayout";
import { products } from "../../mocks/products";
import withPrivateRoute from "../../hocs/withPrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { getActorsServer } from "../../redux/actions/actorActions";
// import { changePasswordServer, getMyProfileServer } from "../../redux/actions/profileActions";
import Button from "../../components/Button/Button";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getProjectListServer } from "../../redux/actions/projectAction";
import { getProjectList, getProjectListLoading } from "../../redux/reducers/projectReducer";
import { humans } from "../../mocks/humans";
import { Link } from "react-router-dom";
import CircularProgress from "../../components/Icons/CircularProgress";
import { diffDays } from "../../lib/diffDays";
import { Project } from "../../types/project";

const HomePage = () => {
  const dispatch = useDispatch();
  const projectList = useSelector(getProjectList);
  const isLoading = useSelector(getProjectListLoading);
  const [activeProject, setActiveProject] = useState<number>();

  useEffect(() => {
    dispatch(getProjectListServer({ keyword: "" }));
    // dispatch(getActorsServer({ keyword: "" }));
    // dispatch(getMyProfileServer());
    // dispatch(changePasswordServer({ newPassword: "123123", oldPassword: "customer@gmail.com" }));
  }, []);

  const handleOpenNewProjectPopup = () => {
    dispatch(
      updatePopup({
        popup: Popups.createNewProjectPopup,
        status: true,
        prefilled: products,
      }),
    );
  };

  const handleOpenHumansPopup = () => {
    dispatch(
      updatePopup({
        popup: Popups.aIHumansPopup,
        status: true,
        prefilled: {
          humans,
        },
      }),
    );
  };

  const settings = {
    dots: false,
    slidesToShow: 5,
    slidesToScroll: 2,
    horizontal: true,
    horizontalSwiping: false,
    infinite: false,
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,

    responsive: [
      //   { //! This code breaks slider!
      //     breakpoint: 1540,
      //     settings: {
      //       slidesToShow: 4,
      //     },
      //   },
      {
        breakpoint: 1001,
        settings: {
          slidesToShow: 5,
        },
      },
    ],
  };

  const handleActiveProject = (e: any, id?: number) => {
    e.preventDefault();

    setActiveProject(id);
  };

  return (
    <Wrapper>
      <SidebarLayout>
        <Content>
          <Title>Our products</Title>
          <MobileOnly>
            <Sidebar mobile />
          </MobileOnly>
          <ProductWrapper>
            {products.map((product) => (
              <ProductCard
                key={product.title}
                image={product.image}
                title={product.title}
                description={product.description}
                link={product.link}
                action={product.title === "AI Humans" ? handleOpenHumansPopup : undefined}
              />
            ))}
          </ProductWrapper>
          <ButtonWrapper>
            <Button text="Create new project" onClick={handleOpenNewProjectPopup} />
          </ButtonWrapper>
          <Title>Recent projects</Title>
          <ProjectsWrapper>
            {isLoading ? (
              <CircularProgress color="#009af7" />
            ) : (
              <SliderStyled {...settings}>
                {projectList &&
                  projectList?.map((project) => {
                    return (
                      <Link key={project.projectId + "project-list"} to={`/actors?projectId=${project.projectId}`}>
                        <ProjectCard
                          project={project}
                          title={project.title}
                          description={project.subTitle}
                          projectTime={project.updateDateTime}
                          image={project.coverImage}
                          active={project.projectId === activeProject}
                          setActiveProject={setActiveProject}
                          handleActiveProject={(e: any) => handleActiveProject(e, project.projectId)}
                        />
                      </Link>
                    );
                  })}
              </SliderStyled>
            )}
          </ProjectsWrapper>
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
  overflow: hidden auto;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ProductWrapper = styled.div`
  display: flex;
  align-items: center;
  row-gap: 12px;
  column-gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 1001px) {
    flex-direction: column;
    margin-bottom: 24px;

    & > div {
      width: 100%;

      :nth-child(4),
      :nth-child(5) {
        width: 100%;
      }
    }
  }
`;

const Title = styled("span")`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  align-items: flex-end;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.primaryText};
  margin-bottom: 16px;
`;

const ProjectsWrapper = styled.div`
  position: relative;
  max-width: 1300px;
  width: 100%;

  .slick-slider:after {
    right: 0px;
    position: absolute;
    top: 0;
    content: "";
    width: 136px;
    height: 120px;
    background: ${({ theme }) => theme.sliderShadow};
    transform: matrix(1, 0, 0, -1, 0, 0);
  }

  @media (max-width: 1001px) {
    .slick-slider:after {
      display: none;
    }
  }
`;

const SliderStyled = styled(Slider)`
  .slick-list {
    width: 1300px;
    position: relative;
    padding-left: 0 !important;
  }

  .slick-track {
    display: flex !important;
    width: auto !important;
  }

  .slick-slide {
    display: flex !important;
    align-items: flex-start;
    width: 220px !important;
    margin-right: 12px;
    height: 120px;
  }

  .slick-slider {
    position: relative;
  }

  .slick-prev {
    top: 50% !important;
    left: 0 !important;
    transform: translate(0, -50%) rotate(180deg);
  }

  .slick-next {
    top: 50% !important;
    right: 0 !important;
    transform: translate(0, -50%);
  }

  .slick-prev,
  .slick-next {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 28px;
    height: 28px;
    background: ${({ theme }) => theme.button};
    border: 2px solid ${({ theme }) => theme.white};
    box-shadow: ${({ theme }) => theme.secondaryButtonShadow};
    border-radius: 12px;
    position: absolute;
    z-index: 5;
  }

  .slick-prev:before,
  .slick-next:before {
    display: none;
  }

  .slick-disabled {
    display: none !important;
  }

  @media (max-width: 1001px) {
    .slick-next,
    .slick-prev {
      display: none !important;
    }
  }
`;

const CustomArrowStyled = styled("button")`
  &:focus {
    border: 2px solid ${({ theme }) => theme.white};
  }
`;

const ButtonWrapper = styled("div")`
  display: none;

  @media (max-width: 1001px) {
    display: flex;
    width: 100%;
    margin-bottom: 40px;
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

const CustomArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <CustomArrowStyled className={className} style={{ ...style }} onClick={onClick}>
      <ArrowRight />
    </CustomArrowStyled>
  );
};

export default withPrivateRoute(HomePage);
