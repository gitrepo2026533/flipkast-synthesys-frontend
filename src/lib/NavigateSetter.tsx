import { useNavigate } from "react-router-dom";
import Navigate from "./Navigate";

const NavigateSetter = () => {
  Navigate.navigate = useNavigate();

  return null;
};

export default NavigateSetter;
