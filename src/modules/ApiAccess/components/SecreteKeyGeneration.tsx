import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { useTheme } from "styled-components";

import ApiAccessBox from "./ApiAccessBox";
import Button, { ButtonThemes } from "../../../components/Button/Button";
import CircularProgress from "../../../components/Icons/CircularProgress";
import { darkTheme } from "../../../themes/themes";
import { Visible } from "../../../components/Icons/Visible";
import { InfoIcon } from "../../../components/Icons/InfoIcon";
import { Invisible } from "../../../components/Icons/Invisible";
import { getGenerateApiKeyLoading, getProfile } from "../../../redux/reducers/profileReducer";
import { generateApiKeyServer, revokeApiKeyServer } from "../../../redux/actions/profileActions";

const SecreteKeyGeneration = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const profile = useSelector(getProfile);
  const generateApiKeyLoading = useSelector(getGenerateApiKeyLoading);

  const [isCopied, setIsCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (value: boolean) => {
    setShowPassword(value);
  };

  const generateApiKey = () => {
    dispatch(generateApiKeyServer());
  };

  const revokeApiKey = () => {
    dispatch(revokeApiKeyServer());
  };

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(profile.apiKey as string).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    });
  };

  if (!Object.keys(profile).length) {
    return (
      <ApiAccessBox title="Secrete key generation">
        <CircularProgressWrapper>
          <CircularProgress color="#009af7" />
        </CircularProgressWrapper>
      </ApiAccessBox>
    );
  }

  return (
    <ApiAccessBox title="Secrete key generation">
      {!profile.apiKey ? (
        <Button
          text={generateApiKeyLoading ? <CircularProgress color="#fff" /> : "Generate"}
          onClick={generateApiKey}
        />
      ) : (
        <>
          <FormInputWrapper flexRow={true} key="secrete-key">
            <FormInputLabel htmlFor="secrete-key">Secrete key</FormInputLabel>
            <FormInputs
              type={showPassword ? "text" : "password"}
              name="password"
              value={profile.apiKey}
              darkTheme={theme === darkTheme}
              active={!showPassword}
              onChange={() => null}
            />
            {handleShowPassword && (
              <FormInputPasswordIcons onClick={() => handleShowPassword(!showPassword)}>
                {showPassword ? <Visible /> : <Invisible />}
              </FormInputPasswordIcons>
            )}
          </FormInputWrapper>
          <DescriptionWrapper>
            <InfoIcon />
            <span>
              Make sure to store your secret key privately and do not share it. Never use your secret key in the
              front-end part of your app or in the browser
            </span>
          </DescriptionWrapper>
          <ButtonWrapper>
            <Button text={isCopied ? "Copied" : "Copy secret key"} onClick={handleCopyClick} />
            <Button text="Revoke" buttonTheme={ButtonThemes.Transparent} onClick={revokeApiKey} />
          </ButtonWrapper>
        </>
      )}
    </ApiAccessBox>
  );
};

const FormInputLabel = styled("label")`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  opacity: 0.6;
  color: ${({ theme }) => theme.primaryText};
`;

const FormInputPasswordIcons = styled("span")`
  position: absolute;
  right: 16px;
  top: 36px;
  cursor: pointer;
  svg {
    path {
      fill: ${({ theme }) => theme.icon};
    }
  }
`;

const FormInputWrapper = styled.div<{ flexRow: boolean }>`
  margin-bottom: 25px;
  position: relative;
  gap: 4px;
  display: flex;
  flex-direction: column;

  ${({ flexRow }) =>
    flexRow &&
    `
      width: ${flexRow}%;
      margin: 0;
      input {
      min-width: auto;
      padding-left: 16px;
     }
     
    @media (max-width: 800px) {
      width: 100%;
      margin-bottom: 16px;
    }    
    `}

  @media (min-width: 320px) and (max-width: 750px) {
    margin-bottom: 15px;
  }

  @media (min-width: 751px) and (max-width: 1150px) {
    margin-bottom: 17px;
  }

  @media (max-height: 750px) {
    margin-bottom: 16px;
  }
`;

const FormInputs = styled("input")<{ darkTheme?: boolean; active?: boolean }>`
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 60px;
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  height: 48px;
  padding-left: 44px;
  padding-right: 44px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  background-repeat: no-repeat;
  background-position: center left 15px;
  min-width: 320px;
  color: ${({ theme }) => theme.primaryText};

  ${({ darkTheme, theme }) =>
    darkTheme &&
    `
      border: 1px solid ${theme.secondaryBackground};
      box-shadow: none;
  
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px ${theme.primaryBackground} inset !important;
        -webkit-text-fill-color: ${theme.primaryText};
        -webkit-border-before-color: ${theme.secondaryBackground};
        -webkit-border-before-style: solid;
        -webkit-border-before-width: 1px;
      }

      &:focus {
        background-color: ${theme.primaryBackground};
        border: 1px solid ${theme.secondaryBackground};
      }
    `}

  &::placeholder {
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.6;
  }

  ${({ active }) =>
    active &&
    `
    font-size: 20px;
  `}
`;

const DescriptionWrapper = styled.div`
  display: flex;
  align-items: start;
  gap: 4px;

  svg {
    flex-shrink: 0;

    path {
      stroke: #e86137;
    }
  }

  span {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.6;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  button:last-of-type {
    justify-content: center;
    max-width: 51px;
    span {
      font-weight: 600;
      letter-spacing: -0.41px;
      background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }
`;

const CircularProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default SecreteKeyGeneration;
