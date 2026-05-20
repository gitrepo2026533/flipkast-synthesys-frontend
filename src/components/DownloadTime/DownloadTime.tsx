import styled from "styled-components";

interface Props {
  title: string;
  timeLeft: string;
  hasUnlimited?: boolean;
  progress: number;
}

const DownloadTime = ({ title, timeLeft, hasUnlimited, progress }: Props) => (
  <Wrapper>
    <div>
      <Title>{title}</Title>
      <TimeLeft>{hasUnlimited ? "Unlimited" : timeLeft}</TimeLeft>
    </div>
    <ProgressBarWrapper>
      <ProgressBar width={progress} />
    </ProgressBarWrapper>
  </Wrapper>
);

const Wrapper = styled("div")`
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 12px;
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 340px;
  max-width: 370px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Title = styled("span")`
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.primaryText};
`;

const TimeLeft = styled("span")`
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
`;

const ProgressBarWrapper = styled("div")`
  background: #dbdce2;
  border-radius: 2px;
  width: 100%;
  height: 10px;
  position: relative;
`;

const ProgressBar = styled("div")<{ width?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%), #0180d8;
  border-radius: 2px;
  height: 10px;
  width: ${({ width }) => width}%;
`;

export default DownloadTime;
