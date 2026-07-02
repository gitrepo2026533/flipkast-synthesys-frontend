import React, { useState } from "react";
import styled from "styled-components";
import TextArea from "../TextArea/TextArea";

const ScriptSidebar = ({
  currentScript,
  handleScriptChange,
}: {
  currentScript: string;
  handleScriptChange: (script: string) => void;
}) => {
  const [script, setScript] = useState(currentScript || "");

  const onScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1500) {
      setScript(e.target.value);
      handleScriptChange(e.target.value);
    }
  };

  return (
    <Wrapper>
      <EditorContainer>
        <TextArea placeholder="Type your script here" value={script} onChange={onScriptChange} rows={20} />
        <BottomRow>
          <CharacterCount>{script.length}/1500</CharacterCount>
        </BottomRow>
      </EditorContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 272px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EditorContainer = styled.div`
  background: ${({ theme }) => theme.primaryBackground};
  border: 1px solid ${({ theme }) => theme.activeMenu};
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 400px;
  box-shadow: ${({ theme }) => theme.secondaryInputShadow || theme.cardShadow};
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
`;

const CharacterCount = styled.span`
  color: ${({ theme }) => theme.primaryText}66;
  font-size: 12px;
  font-family: "Montserrat", sans-serif;
`;

export default ScriptSidebar;
