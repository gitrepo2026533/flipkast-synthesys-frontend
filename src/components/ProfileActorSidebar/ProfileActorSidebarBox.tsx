import styled from "styled-components";
import { SidebarBox } from "../../types/sidebarBox";

interface Props {
  title: string;
  background: string;
  values: {
    id?: string | number;
    text: string;
    label?: string;
  }[];
  modifier?: string;
  step: number;
  value: number;
  handleChange: (e: any) => void;
}

const ProfileActorSidebarBox = ({ title, background, values, modifier, step, value, handleChange }: Props) => (
  <Wrapper>
    <Content>
      <Heading>
        <span>{title}</span>
        <div style={{ background }} />
      </Heading>
      <ProgressBar>
        <ProgressBarLine
          value={value}
          type="range"
          min="0"
          max="100"
          step={step}
          width={value}
          onChange={handleChange}
        />
      </ProgressBar>
      <Footer>
        {values.map((value) => (
          <span key={value.id}>{value.label ? value.label + (modifier ? modifier : "") : ""}</span>
        ))}
      </Footer>
    </Content>
  </Wrapper>
);

const Wrapper = styled.div`
  background: ${({ theme }) => theme.secondaryBackground};
  box-shadow: ${({ theme }) => theme.secondaryCardShadow};
  border-radius: 12px;
  width: 232px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: ${({ theme }) => theme.secondaryText};
    text-transform: capitalize;
  }

  div {
    width: 24px;
    height: 16px;
    border-radius: 28px;
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.secondaryBackground};
  box-shadow: ${({ theme }) => theme.secondaryInputShadow};
  border-radius: 60px;
  display: flex;
  align-items: center;
`;

const ProgressBarLine = styled.input<{ width: number }>`
  background: ${({ theme }) => theme.secondaryBackground};
  box-shadow: ${({ theme }) => theme.secondaryCardShadow};
  border-radius: 80px;
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;

  ::-webkit-slider-runnable-track {
    background: ${({ theme, width }) => `linear-gradient(to right, ${theme.activeMenu} ${width}%, transparent 0)`};
    height: 4px;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: ${({ theme }) => theme.white};
    width: 4px;
    height: 4px;
    padding: 2px;
    margin-top: -2px;
    border: 2px solid ${({ theme }) => theme.activeMenu};
    border-radius: 52px;
    cursor: pointer;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.secondaryText};
    opacity: 0.4;
  }
`;

export default ProfileActorSidebarBox;
