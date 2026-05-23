/* eslint-disable prettier/prettier */
import styled from "styled-components";

interface ProjectCardProps {
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
}

const VideoProjectCard = ({
  title,
  // description,
  image,
  onClick,
}: ProjectCardProps) => {
  return (
    <CardWrapper onClick={onClick}>
      <CardImageWrapper>
        <CardImage src={image} alt={title} />
        {/* <ImageOverlay /> */}
        {/* <CardBigTitle>{title}</CardBigTitle> */}
      </CardImageWrapper>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>{description}</CardDescription> */}
      </CardContent>
    </CardWrapper>
  );
};

export default VideoProjectCard;

const CardWrapper = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.22s ease;
  &:hover {
    transform: translateY(-4px);
  }
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #111;
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  @media (max-width: 768px) {
    height: 190px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.45) 40%,
      rgba(0, 0, 0, 0.08) 100%
    );
`;

const CardBigTitle = styled.h2`
  position: absolute;
  left: 16px;
  bottom: 8px;
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: clamp(36px, 5vw, 74px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -3px;
  text-transform: uppercase;
  color: white;
  text-shadow:
    0 4px 14px rgba(0, 0, 0, 0.45),
    0 2px 4px rgba(0, 0, 0, 0.3);
  user-select: none;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 2px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.primaryText};
  letter-spacing: -0.4px;
`;

const CardDescription = styled.p`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.62;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;