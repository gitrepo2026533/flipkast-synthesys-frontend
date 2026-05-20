import React from "react";
import styled from "styled-components";

import ApiAccessBox from "./ApiAccessBox";
import Button, { ButtonThemes } from "../../../components/Button/Button";

const ApiAccessInformationBox = () => (
  <ApiAccessBox title="API Access">
    <Description>
      Get access to Play.ht through the API. If you’re a developer, you can integrate text-to-speech conversions into
      your application using our API. The API provides a single interface to convert text to speech using our vast
      library of voices and languages.
    </Description>
    <Description>
      To get started, take a look at our API documentation. When you’re ready, generate a secret key from the
      credentials panel below, and use your credentials to communicate with the API.
    </Description>
    <ButtonWrapper>
      <Button
        text="API documentation"
        buttonTheme={ButtonThemes.Transparent}
        onClick={() => window?.open("https://google.com", "_blank")?.focus()}
      />
    </ButtonWrapper>
  </ApiAccessBox>
);

const Description = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #6f7074;
`;

const ButtonWrapper = styled.div`
  max-width: 135px;
  button > span {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.41px;
    background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export default ApiAccessInformationBox;
