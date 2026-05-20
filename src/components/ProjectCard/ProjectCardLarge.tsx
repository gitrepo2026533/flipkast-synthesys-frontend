import React from "react";
import styled from "styled-components";
import { ClockIcon } from "../Icons/Icons";

interface ProjectCardProps {
  title: string;
  projectTime?: string;
  image?: string;
}

const ProjectCardLarge = ({ title, projectTime, image }: ProjectCardProps) => {
  const time: any = new Date(projectTime + "Z");
  const today: any = new Date();
  const diffTime = Math.abs(today - time);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <Wrapper>
      {image ? <Image src={image} alt={title} /> : <EmptyImage />}
      <Fade>
        <Title>{title}</Title>
        <ProjectTime>
          <ProjectTimeText>Edited {diffDays}d ago</ProjectTimeText>
          <ClockIcon />
        </ProjectTime>
      </Fade>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f0f0f3;
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  position: relative;
`;

const Fade = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52px;
  background: ${({ theme }) => theme.characterActionsBackground};
  display: flex;
  padding: 16px 12px 12px;

  @media (max-width: 550px) {
    flex-direction: column;
    row-gap: 2px;
    height: 60px;
  }
`;

const Title = styled.p`
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #191b1f;
`;

const ProjectTime = styled.div`
  display: flex;
  column-gap: 4px;
  align-items: center;
`;

const ProjectTimeText = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #191b1f;
`;

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const EmptyImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.disableIcon}33;
  border-radius: 3px;
`;

export default ProjectCardLarge;
