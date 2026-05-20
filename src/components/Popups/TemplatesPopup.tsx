import React from "react";
import Slider from "react-slick";
import styled from "styled-components";

import Modal from "../Modal/Modal";
import Button, { ButtonThemes } from "../Button/Button";
import Textfield from "../Textfield/Textfield";
import { ArrowRight, DownloadIcon, SearchIcon } from "../Icons/Icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TemplatesPopup = ({ open, onClose }: Props) => {
  const settings = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    horizontal: true,
    horizontalSwiping: false,
    infinite: true,
    variableWidth: true,
    nextArrow: <CustomArrow />,
  };

  return (
    <Modal open={open} onClose={onClose} closeIcon={false} maxWidth={1276} maxHeight={704}>
      <OuterWrapper>
        <Row>
          <Title>Templates</Title>
          <Actions>
            <Import>
              <DownloadIcon />
              <ImportText>Import</ImportText>
            </Import>
            <Textfield placeholder="Search" startAdornment={<SearchIcon />} />
          </Actions>
        </Row>
        <Categories>
          <CategorySection>
            <CategoryName>Office</CategoryName>
            <SliderStyled {...settings}>
              <TemplateCard>
                <TemplateImage src={"https://miro.medium.com/max/1400/1*xMuIOwjliGUPjkzukeWKfw.jpeg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
            </SliderStyled>
          </CategorySection>
          <CategorySection>
            <CategoryName>Office</CategoryName>
            <SliderStyled {...settings}>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
            </SliderStyled>
          </CategorySection>
          <CategorySection>
            <CategoryName>Office</CategoryName>
            <SliderStyled {...settings}>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
              <TemplateCard>
                <TemplateImage src={"https://i.stack.imgur.com/ZN6oD.jpg"} />
              </TemplateCard>
            </SliderStyled>
          </CategorySection>
        </Categories>
        <ActionsWrapper>
          <Button text="Cancel" buttonTheme={ButtonThemes.Outline} />
          <Button text="Add" />
        </ActionsWrapper>
      </OuterWrapper>
    </Modal>
  );
};

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: relative;

  @media (max-width: 1100px) {
    width: 540px;
  }

  @media (max-width: 600px) {
    width: 280px;
  }
`;

const Row = styled.div`
  display: flex;

  @media (max-width: 1100px) {
    column-gap: 20px;
    align-items: center;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    row-gap: 16px;
    align-items: flex-start;
  }
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 40px;
  line-height: 52px;
  color: #191b1f;
  flex: 1;

  @media (max-width: 600px) {
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: #191b1f;
  }
`;

const Actions = styled.div`
  display: flex;
  column-gap: 24px;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: row-reverse;
    column-gap: 16px;
  }
`;

const Import = styled.div`
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  display: flex;
  column-gap: 4px;
  align-items: center;
  & path {
    fill: #0063b4;
  }
`;

const ImportText = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;

  @media (max-width: 600px) {
    display: none;
  }
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  padding-bottom: 100px;
  max-height: 600px;
  padding-right: 20px;
  overflow: hidden auto;

  @media (max-width: 1380px) {
    padding-right: 5px;
  }

  @media (max-width: 1001px) {
    ::-webkit-scrollbar {
      display: none;
    }
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

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

const CategoryName = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #191b1f;
`;

const SliderStyled = styled(Slider)`
  .slick-list {
    width: 1276px;
    position: relative;
    padding-left: 0 !important;
  }

  .slick-slide {
    display: flex !important;
    align-items: center;
    width: 260px !important;
    margin-right: 8px;
    height: 160px;
  }

  .slick-slide > div {
    height: 100%;
  }

  .slick-slider {
    position: relative;
  }

  .slick-next {
    top: 50% !important;
    right: 0 !important;
    transform: translate(0, -50%);
  }

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

  .slick-track {
    display: flex;
    flex-direction: row;
  }

  .slick-disabled {
    display: none !important;
  }

  .slick-prev {
    display: none !important;
  }

  @media (max-width: 1380px) {
    .slick-list {
      width: 1000px;
      position: relative;
      padding-left: 0 !important;
    }
  }

  @media (max-width: 1100px) {
    .slick-next {
      display: none !important;
    }

    .slick-list {
      width: 540px;
    }
  }

  @media (max-width: 600px) {
    .slick-list {
      width: 280px;
    }
  }
`;

const CustomArrowStyled = styled("div")`
  :before {
    display: none;
  }
`;

const TemplateCard = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
`;

const TemplateImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Fade = styled.div`
  position: absolute;
  width: 160px;
  background: linear-gradient(
    180deg,
    rgba(240, 240, 243, 0) 0%,
    rgba(240, 240, 243, 0.6) 21.34%,
    rgba(240, 240, 243, 0.8126) 42.26%,
    #f0f0f3 100%
  );
  transform: rotate(-90deg);
  right: -24px;
  top: 0;
  bottom: 0;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.characterActionsBackground};
  height: 100px;
  bottom: 0;
  position: absolute;
  width: 100%;
  z-index: 10;
  button {
    width: 161.5px;
  }

  @media (max-width: 600px) {
    align-items: center;
    height: 80px;
    width: 99%;
    button {
      width: 136px;
    }
  }
`;

const CustomArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div>
      <CustomArrowStyled className={className} style={{ ...style }} onClick={onClick}>
        <ArrowRight />
      </CustomArrowStyled>
      <Fade />
    </div>
  );
};

export default TemplatesPopup;
