import { formatDistance } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { sliceString } from "../../lib/formatUtils";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import { updateProjectServer } from "../../redux/actions/projectAction";
import { Project } from "../../types/project";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import BinIcon from "../Icons/BinIcon";
import CircularProgress from "../Icons/CircularProgress";
import { ClockIcon, EditIcon } from "../Icons/Icons";
import Textfield, { TextfieldVariant } from "../Textfield/Textfield";

interface ProjectCardProps {
  project: Project;
  title: string;
  description?: string;
  projectTime?: string;
  image?: string;
  fullWidth?: boolean;
  active?: boolean;
  setActiveProject?: any;
  handleActiveProject?: (e: any) => void;
}

const ProjectCard = ({
  project,
  title,
  description,
  projectTime,
  image,
  fullWidth = false,
  active,
  setActiveProject,
  handleActiveProject,
}: ProjectCardProps) => {
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState<string>(title);
  const [isLoading, setIsLoading] = useState<string | number>("");

  const handleChange = (e: any) => setProjectName(e.target.value);

  const handleKeyPress = (e: any, type?: "blur") => {
    if (e.code === "Enter" || type) {
      if (!project) throw Error("Project entity is missing while renaming");
      if (projectName !== project?.title) {
        dispatch(updateProjectServer(project?.projectTypeId, project?.projectId, projectName));
      }
      setActiveProject(null);
    }
  };

  useEffect(() => {
    setProjectName(project.title);
  }, [project.title]);

  const handleDeleteClick = (e: any) => {
    // setIsLoading(project?.projectId || "");
    if (!project.projectId) {
      throw Error("Project entity is missing while deleting");
    }
    e.stopPropagation();
    e.preventDefault();
    dispatch(
      updatePopup({
        popup: Popups.confirmationPopup,
        status: true,
        prefilled: {
          project,
          title: "Are you sure you want to delete project " + project.title,
          description: "The project will be removed and the action cannot be undone",
        },
      }),
    );
    // dispatch(deleteProjectserver({ projectId: project.projectId.toString() }));
  };

  return (
    <Wrapper fullWidth={fullWidth}>
      <Left>
        <TitleWrapper onClick={handleActiveProject}>
          {!active ? (
            <>
              <Title>{title}</Title>
              <IconButton iconButtonTheme={IconButtonThemes.Transparent} icon={<EditIcon />} />
            </>
          ) : (
            <Textfield
              autoFocus
              variant={TextfieldVariant.project}
              value={projectName}
              placeholder="Enter project name"
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              onBlur={(e) => handleKeyPress(e, "blur")}
            />
          )}
        </TitleWrapper>
        {description && <Description>{sliceString(description, 40)}</Description>}
        {projectTime && (
          <TimeWrapper>
            <ClockIcon />
            <ProjectTime>Ed. {formatDistance(new Date(projectTime + "Z"), new Date())} ago</ProjectTime>
          </TimeWrapper>
        )}
      </Left>
      <ImageWrapper>
        {isLoading == project?.projectId && <CircularProgress />}
        <div className="delete" onClick={handleDeleteClick}>
          <BinIcon />
        </div>
        <Image src={image ? image : "/images/projectMock.png"} alt={title} />
      </ImageWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ fullWidth?: boolean }>`
  padding: 12px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.iconButtonShadow};
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  gap: 4px;
  width: 220px;

  &:hover {
    .delete {
      opacity: 1;
    }
  }

  ${({ fullWidth }) =>
    fullWidth &&
    `
    width: 100%;
  `}
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 4px;

  button {
    svg > path {
      fill: ${({ theme }) => theme.icon};
    }
  }
`;

const Title = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.primaryText};
`;

const Description = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  word-break: break-all;
  -webkit-box-orient: vertical;
`;

const ProjectTime = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;

  & > svg > path {
    fill: ${({ theme }) => theme.icon};
  }
`;

const ImageWrapper = styled.div`
  width: 40px;
  height: 40px;
  position: relative;

  .loader {
    position: absolute;
    z-index: 300;
    background-color: white;
    border-radius: 50%;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;

    path {
      fill: #009af7;
    }
  }

  .delete {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: 0.3s;
    z-index: 8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 50%;

    svg {
      margin: auto;
      width: 20px;
      height: auto;

      path {
        fill: red;
      }
    }
  }
`;

const Image = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 40px;
  height: 40px;
`;

const EmptyImage = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.disableIcon}33;
  border-radius: 3px;
`;

export default ProjectCard;
