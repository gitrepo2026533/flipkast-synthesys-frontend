import React from "react";
import styled, { useTheme } from "styled-components";

import { addPx, removePx } from "../../../lib/stylesHelper";

import { Text, TextAlign } from "../../../types/scene";

import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import Textfield, { TextfieldVariant } from "../../../components/Textfield/Textfield";
import {
  BoldIcon,
  ItalicIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from "../../../components/Icons/Icons";

interface Props {
  currentObject?: Text;
  handleObjectsChange: (key: string, value: any, id: number) => void;
}

const PropertiesPanel = ({ currentObject, handleObjectsChange }: Props) => {
  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, fontFamily: value }, currentObject.id);
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, fontSize: addPx(value) }, currentObject.id);
  };

  const handleLineSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, lineHeight: value }, currentObject.id);
  };

  const handleItalicChange = () => {
    const newStyle = currentObject?.style.fontStyle === "italic" ? "inherit" : "italic";
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, fontStyle: newStyle }, currentObject.id);
  };

  const handleSetBold = () => {
    const newStyle = currentObject?.style.fontWeight === "700" ? "400" : "700";
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, fontWeight: newStyle }, currentObject.id);
  };

  const handleUnderlineChange = () => {
    const newStyle = currentObject?.style.textDecoration === "underline" ? "none" : "underline";
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, textDecoration: newStyle }, currentObject.id);
  };

  const handleTextAlignChange = (value: TextAlign) => {
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, textAlign: value }, currentObject.id);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentObject) return;
    handleObjectsChange("style", { ...currentObject.style, color: event.target.value }, currentObject.id);
  };

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = +event.target.value;
    if ((!value && value !== 0) || !currentObject) return;
    const newValue = value / 100;
    handleObjectsChange("style", { ...currentObject.style, opacity: newValue }, currentObject.id);
  };

  return (
    <PanelItem>
      <PropertiesWrapper>
        <Row>
          <PropertyName>Font family</PropertyName>
          <select name="fonts" onChange={handleFontChange}>
            <option value="Montserrat">Montserrat</option>
            <option value="MATH">MATH</option>
          </select>
        </Row>
        <Row>
          <PropertyName>Font size</PropertyName>
          <Textfield
            variant={TextfieldVariant.noneAdornment}
            placeholder={removePx(String(currentObject?.style.fontSize || ""))}
            value={removePx(String(currentObject?.style.fontSize || ""))}
            onChange={handleFontSizeChange}
          />
        </Row>
        <Row>
          <PropertyName>Line spacing</PropertyName>
          <Textfield
            variant={TextfieldVariant.noneAdornment}
            placeholder={removePx(String(currentObject?.style.lineHeight || ""))}
            value={removePx(String(currentObject?.style.lineHeight || ""))}
            onChange={handleLineSpacingChange}
          />
        </Row>
        <Row>
          <PropertyName>Font style</PropertyName>
          <PropertiesRow>
            <IconButton
              onClick={handleItalicChange}
              iconButtonTheme={IconButtonThemes.Transparent}
              icon={<ItalicIcon />}
            />
            <IconButton onClick={handleSetBold} iconButtonTheme={IconButtonThemes.Transparent} icon={<BoldIcon />} />
            <IconButton
              onClick={handleUnderlineChange}
              iconButtonTheme={IconButtonThemes.Transparent}
              icon={<UnderlineIcon />}
            />
          </PropertiesRow>
        </Row>
        <Row>
          <PropertyName>Text align</PropertyName>
          <PropertiesRow>
            <IconButton
              onClick={() => handleTextAlignChange("left")}
              iconButtonTheme={IconButtonThemes.Transparent}
              icon={<TextAlignLeftIcon />}
            />
            <IconButton
              onClick={() => handleTextAlignChange("center")}
              iconButtonTheme={IconButtonThemes.Transparent}
              icon={<TextAlignCenterIcon />}
            />
            <IconButton
              onClick={() => handleTextAlignChange("right")}
              iconButtonTheme={IconButtonThemes.Transparent}
              icon={<TextAlignRightIcon />}
            />
          </PropertiesRow>
        </Row>
        <Row>
          <PropertyName>Font color</PropertyName>
          <ColorInput type="color" value={currentObject?.style.color} onChange={handleColorChange} />
        </Row>
        <Row>
          <PropertyName>Opacity</PropertyName>
          <Textfield
            variant={TextfieldVariant.noneAdornment}
            placeholder={String(Math.floor((currentObject?.style.opacity as number) * 100) || "")}
            value={String(Math.floor((currentObject?.style.opacity as number) * 100) || "")}
            onChange={handleOpacityChange}
          />
        </Row>
      </PropertiesWrapper>
    </PanelItem>
  );
};

const PanelItem = styled.div`
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 20px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.activeMenu};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PropertyName = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.primaryText};
`;

const PropertiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const PropertiesRow = styled.div`
  display: flex;
  column-gap: 12px;
  align-items: center;

  svg > path,
  svg > rect {
    fill: ${({ theme }) => theme.icon};
  }

  .underline {
    fill: ${({ theme }) => (theme.primaryBackground === "#F0F0F3" ? theme.white : theme.darkText)} !important;
  }
`;

const ColorInput = styled.input`
  -webkit-appearance: none;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.icon};
  cursor: pointer;

  &::-webkit-color-swatch {
    border: 1px solid ${({ theme }) => theme.icon};
    border-radius: 50%;
    padding: 0;
  }

  &::-webkit-color-swatch-wrapper {
    border: none;
    border-radius: 50%;
    padding: 0;
  }
`;

export default PropertiesPanel;
