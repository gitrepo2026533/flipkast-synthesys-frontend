import styled from "styled-components";
import CheckMark from "../CheckMark/CheckMark";

interface Props {
  label: string;
  checkMarks: {
    id: number;
    title: string;
  }[];
  active: number;
  handleActive: (id: number) => void;
}

const CheckMarksWithLabel = ({ label, checkMarks, active, handleActive }: Props) => (
  <div>
    <Label>{label}</Label>
    <CheckMarkWrapper>
      {checkMarks.map((mark) => (
        <CheckMark
          key={mark.id}
          title={mark.title}
          active={active === mark.id}
          handleClick={() => handleActive(mark.id)}
        />
      ))}
    </CheckMarkWrapper>
  </div>
);

const Label = styled.label`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
  display: flex;
  margin-bottom: 10px;
`;

const CheckMarkWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export default CheckMarksWithLabel;
