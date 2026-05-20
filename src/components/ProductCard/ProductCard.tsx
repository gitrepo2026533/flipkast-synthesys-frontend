import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import IconButton from "../Button/IconButton";
import { ArrowRight } from "../Icons/Icons";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  link?: string;
  onClose?: (e: any) => void;
  action?: () => void;
}

const ProductCard = ({ image, title, description, link, onClose, action }: ProductCardProps) => (
  <Wrapper disabled={!!link}>
    <Image src={image} alt="" />
    <TextWithAction className="text-with-actions">
      <TextWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextWrapper>
    </TextWithAction>
    {link && (
      <ButtonWrapper className="button-wrapper" onClick={onClose}>
        <Link to={link as string}>
          <IconButton icon={<ArrowRight />} onClick={action} />
        </Link>
      </ButtonWrapper>
    )}
    {!link && (
      <ComingSoonLabel>
        <span>Coming soon</span>
      </ComingSoonLabel>
    )}
  </Wrapper>
);

const Wrapper = styled.div<{ disabled?: boolean }>`
  position: relative;
  border-radius: 16px;
  width: 100%;
  min-height: 330px;
  max-height: 330px;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.mainCardBackground};
  box-shadow: ${({ theme }) => theme.mainCardShadow};
  filter: ${({ theme }) => theme.mainCardFilter};

  ::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    max-height: 330px;
    top: 0;
    left: 0;
    border-radius: 16px;
    background: ${({ theme }) => theme.mainCardBackgroundAfter};
    box-shadow: ${({ theme }) => theme.mainCardShadow};

    ${({ disabled, theme }) =>
      disabled &&
      `
        background: ${theme.mainCardBackgroundAfterExists};
    `}
  }

  @media (max-width: 1001px) {
    min-height: 120px;
    max-height: 120px;

    ::after {
      max-height: 120px;
    }
  }
`;

const Image = styled.img`
  display: block;
  object-fit: cover;
  border-radius: 16px;
  width: 100%;
  min-height: 330px;
  max-height: 330px;

  @media (max-width: 1001px) {
    min-height: 120px;
    max-height: 120px;
  }
`;

const TextWithAction = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 32px);
  z-index: 5;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Title = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.darkText};
`;

const Description = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.darkText};
  opacity: 0.6;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  box-shadow: ${({ theme }: any) => theme.secondaryButtonShadow};
  border-radius: 12px;
  z-index: 5;

  & > a > button {
    box-shadow: none;
  }
`;

const ComingSoonLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  background: ${({ theme }) => theme.white}b2;
  border: 2px solid #f0f0f3;
  box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.1), inset 2px 2px 4px #ffffff;
  border-radius: 12px;
  transform: rotate(-10.55deg) translate(-50%, -50%);
  height: 32px;
  min-width: 130px;
  max-width: 130px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;

  & > span {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.darkText};
  }
`;

export default ProductCard;
