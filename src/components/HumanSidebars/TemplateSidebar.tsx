import React from "react";
import styled from "styled-components";

interface Props {
  data: {
    title?: string;
    images?: string[];
  }[];
}

const TemplateSidebar = ({ data }: Props) => {
  return (
    <Wrapper>
      <Content>
        {data.map(({ title, images }, order: number) => (
          <BlockSlide key={order}>
            <span>{title}</span>
            <div>
              {images?.map((image: string, id: number) => (
                <img key={id} src={image} alt="" />
              ))}
            </div>
          </BlockSlide>
        ))}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.activeMenu};
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  padding: 16px;
  border-radius: 20px;
  min-height: 436px;
  max-height: 436px;
  overflow: hidden auto;
  margin-top: 12px;

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.secondaryBackground}f;
  }

  ::-webkit-scrollbar-track {
    margin: 15px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BlockSlide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: ${({ theme }) => theme.primaryText};
  }

  div {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    gap: 8px;
    width: 100%;

    img {
      width: 140px;
      height: 92px;
      border-radius: 12px;
    }
  }
`;

export default TemplateSidebar;
