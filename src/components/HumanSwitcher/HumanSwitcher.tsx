import styled from "styled-components";
import { BackgroundProps } from "../../mocks/humans";
import Button from "../Button/Button";

interface Props {
  data: any;
  active: BackgroundProps;
  handleActive: (background: BackgroundProps) => void;
}

const HumanSwitcher = ({ data, active, handleActive }: Props) => {
  return (
    <Wrapper>
      {data.map(({ type }: any, order: number) => (
        <Button
          key={order}
          text={type}
          className={type === active ? "active" : "not-active"}
          onClick={() => handleActive(type)}
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 4px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.themeSwitcherShadow};
  border-radius: 60px;
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;

  button {
    border-radius: 52px;
    height: 40px;

    span {
      font-size: 14px;
      line-height: 24px;
    }

    &.not-active {
      background: transparent;
      box-shadow: none;
      opacity: 0.4;

      span {
        font-weight: 500;
        color: ${({ theme }) => theme.primaryText};
      }
    }
  }
`;

export default HumanSwitcher;
