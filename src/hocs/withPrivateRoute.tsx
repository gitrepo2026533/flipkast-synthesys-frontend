import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { getIsAuthorized } from "../redux/reducers/authReducer";
import { pages } from "../lib/routeUtils";

const withPrivateRoute = (Component: any) => {
  const Auth = (props: any) => {
    const isAuthorized = useSelector(getIsAuthorized);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthorized) {
        // Navigate.push(pages.signIn());
        navigate(pages.signIn());
      }
    }, [isAuthorized]);

    return isAuthorized ? <Component {...props} /> : <Placeholder />;
  };

  return Auth;
};

const Placeholder = styled("div")`
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  min-height: 100vh;
`;

export default withPrivateRoute;
