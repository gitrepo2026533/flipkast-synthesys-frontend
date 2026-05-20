import React, { useState } from "react";
import styled from "styled-components";
import Soundtrack from "../Sountrack/Soundtrack";

interface Props {
  data: {
    id: number;
    title: string;
    soundtrack: string;
  }[];
}

const SoundtrackSidebar = ({ data }: Props) => {
  const [activeSoundtrack, setActiveSoundtrack] = useState<number>(0);

  const handlePlayingSoundtrack = (id: number) => {
    setActiveSoundtrack(id - 1);
  };

  return (
    <Wrapper>
      <Content>
        {data.map(({ title, soundtrack, id }) => (
          <Soundtrack
            key={id}
            active={id === activeSoundtrack + 1}
            title={title}
            soundtrack={data[activeSoundtrack as number]?.soundtrack}
            onClick={() => handlePlayingSoundtrack(id)}
          />
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
  min-height: 150px;
  overflow: hidden auto;
  width: 272px;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

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

export default SoundtrackSidebar;
