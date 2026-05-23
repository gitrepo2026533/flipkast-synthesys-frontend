/* eslint-disable prettier/prettier */
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { AttachmentIcon } from "../Icons/AttachmentIcon";
import { ArrowUpIcon } from "../Icons/ArrowUpIcon";
import InputChip from "../Chip/inputChip";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;

    placeholder?: string;

    width?: string;
    minHeight?: string;
    maxHeight?: string;

    chips?: {
        title: string;
        isActive?: boolean;
    }[];

    attachedFiles?: File[];
    setAttachedFiles?: React.Dispatch<
        React.SetStateAction<File[]>
    >;
    models?: string[];
    selectedModel?: string;
    onSelectModel?: (model: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSend,
    placeholder = "Message...",
    width = "100%",
    minHeight = "36px",
    maxHeight = "120px",
    chips = [],
    attachedFiles = [],
    setAttachedFiles,
    models = [],
    selectedModel = models[0],
    onSelectModel,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showModelMenu, setShowModelMenu] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] =
        useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInput = () => {
        const el = textareaRef.current;

        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const handleChooseFile = () => {
        fileInputRef.current?.click();
        setShowAttachmentMenu(false);
    };

    const handleFilesSelected = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files || !setAttachedFiles) return;
        const filesArray = Array.from(e.target.files);
        setAttachedFiles((prev) => [...prev, ...filesArray]);
    };

    const removeAttachedFile = (index: number) => {
        if (!setAttachedFiles) return;
        setAttachedFiles((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    return (
        <Wrapper width={width}>
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFilesSelected}
            />

            <PromptWrapper>
                {attachedFiles.length > 0 && (
                    <PreviewImagesWrapper>
                        {attachedFiles.map((file, index) => {
                            const isImage = file.type.startsWith("image/");

                            return (
                                <PreviewCard key={index}>
                                    {isImage ? (
                                        <PreviewImage
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                        />
                                    ) : (
                                        <FilePreview>
                                            📄
                                        </FilePreview>
                                    )}

                                    <RemovePreviewButton
                                        onClick={() =>
                                            removeAttachedFile(index)
                                        }
                                    >
                                        ✕
                                    </RemovePreviewButton>
                                </PreviewCard>
                            );
                        })}
                    </PreviewImagesWrapper>
                )}

                <PromptTextarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    $minHeight={minHeight}
                    $maxHeight={maxHeight}
                />

                <BottomBar>
                    <LeftActions>
                        <AttachmentWrapper>
                            <AttachmentButton
                                onClick={() =>
                                    setShowAttachmentMenu((prev) => !prev)
                                }
                            >
                                <AttachmentIcon />
                            </AttachmentButton>

                            {showAttachmentMenu && (
                                <AttachmentMenu>
                                    <AttachmentMenuItem
                                        onClick={handleChooseFile}
                                    >
                                        Upload File
                                    </AttachmentMenuItem>

                                    <AttachmentMenuItem
                                        onClick={handleChooseFile}
                                    >
                                        Upload Image
                                    </AttachmentMenuItem>
                                </AttachmentMenu>
                            )}
                        </AttachmentWrapper>

                        {chips.length > 0 && <Divider />}

                        {chips.map((chip, index) => (
                            <InputChip
                                key={index}
                                title={chip.title}
                                isActive={chip.isActive}
                            />
                        ))}
                    </LeftActions>

                    <RightActions>
                        <ModelWrapper>
                            <ModelButton
                                onClick={() =>
                                    setShowModelMenu((prev) => !prev)
                                }
                            >
                                {selectedModel}
                            </ModelButton>

                            {showModelMenu && (
                                <ModelMenu>
                                    {models.map((model) => (
                                        <ModelMenuItem
                                            key={model}
                                            $active={model === selectedModel}
                                            onClick={() => {
                                                onSelectModel?.(model);
                                                setShowModelMenu(false);
                                            }}
                                        >
                                            {model}
                                        </ModelMenuItem>
                                    ))}
                                </ModelMenu>
                            )}
                        </ModelWrapper>
                        <SendButton
                            $active={!!value.trim()}
                            onClick={onSend}
                        >
                            <ArrowUpIcon />
                        </SendButton>
                    </RightActions>
                </BottomBar>
            </PromptWrapper>
        </Wrapper>
    );
};

export default ChatInput;

const Wrapper = styled.div<{ width: string }>`
  width: ${({ width }) => width};
`;

const PromptWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.editor};
  border: 1px solid
    ${({ theme }) => theme.editorLineBorder};
  border-radius: 16px;
  padding: 10px 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.editorShadow};
  transition: border-color 0.2s ease;
  &:focus-within {
    border-color: ${({ theme }) => theme.activeMenu};
  }
`;

const PromptTextarea = styled.textarea<{
    $minHeight: string;
    $maxHeight: string;
}>`
  width: 100%;
  min-height: ${({ $minHeight }) => $minHeight};
  max-height: ${({ $maxHeight }) => $maxHeight};
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  color: ${({ theme }) => theme.primaryText};
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  line-height: 1.6;
  padding: 0;
  &::placeholder {
    color: ${({ theme }) => theme.editorFileUpload};
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
        theme.editorLineBorder};
    border-radius: 999px;
  }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const AttachmentWrapper = styled.div`
  position: relative;
`;

const AttachmentButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid
    ${({ theme }) => theme.editorLineBorder};
  background: ${({ theme }) =>
        theme.editorDropDownContent};
  color: ${({ theme }) => theme.editorFileUpload};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background: ${({ theme }) =>
        theme.menuListItemActive};
    color: ${({ theme }) => theme.primaryText};
    transform: translateY(-1px);
  }
`;

const AttachmentMenu = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  min-width: 160px;
  background: ${({ theme }) => theme.editor};
  border: 1px solid
    ${({ theme }) => theme.editorLineBorder};
  border-radius: 12px;
  overflow: hidden;
  z-index: 20;
`;

const AttachmentMenuItem = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryText};
  font-size: 12px;
  &:hover {
    background: ${({ theme }) =>
        theme.editorDropDownContent};
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background: ${({ theme }) => theme.editorLineBorder};
`;

const SendButton = styled.button<{
    $active: boolean;
}>`
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $active }) =>
        $active ? "pointer" : "default"};
  background: ${({ theme, $active }) =>
        $active
            ? theme.button
            : theme.editorDropDownContent};
  box-shadow: ${({ theme, $active }) =>
        $active ? theme.buttonShadow : "none"};
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme, $active }) =>
        $active ? theme.white : theme.editorFileUpload};  }
  &:hover {
    transform: ${({ $active }) =>
        $active ? "scale(1.06)" : "none"};
  }
`;

const ModelWrapper = styled.div`
  position: relative;
`;

const ModelButton = styled.button`
  height: 28px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.editorLineBorder};
  background: ${({ theme }) =>
        theme.editorDropDownContent};
  color: ${({ theme }) => theme.primaryText};
  font-size: 12px;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.activeMenu};
  }
`;

const ModelMenu = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  min-width: 180px;
  background: ${({ theme }) => theme.editor};
  border: 1px solid
    ${({ theme }) => theme.editorLineBorder};
  border-radius: 12px;
  overflow: hidden;
  z-index: 50;
  box-shadow: ${({ theme }) =>
        theme.editorMenuShadow};
`;

const ModelMenuItem = styled.button<{
    $active?: boolean;
}>`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: ${({ theme, $active }) =>
        $active
            ? theme.menuListItemActive
            : "transparent"};

  color: ${({ theme }) => theme.primaryText};
  text-align: left;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background: ${({ theme }) =>
        theme.menuListItemActive};
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreviewImagesWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
        theme.editorLineBorder};
    border-radius: 999px;
  }
`;

const PreviewCard = styled.div`
  width: 84px;
  height: 84px;
  min-width: 84px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) =>
        theme.editorDropDownContent};
  border: 1px solid
    ${({ theme }) => theme.editorLineBorder};
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FilePreview = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: ${({ theme }) => theme.primaryText};
`;

const RemovePreviewButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.overlayBackground};
  color: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  backdrop-filter: blur(10px);
  transition: 0.2s ease;
  &:hover {
    transform: scale(1.08);
  }
`;