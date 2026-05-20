import { ThemeProvider } from "styled-components";
import * as Sentry from "@sentry/react";
import Router from "./routes";

import { useDarkMode } from "./hooks/useDarkMode";
import { ThemeTypes } from "./types/theme";
import { darkTheme, lightTheme } from "./themes/themes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMyProfileServer } from "./redux/actions/profileActions";
import { useSelector } from "react-redux";
import { getIsAuthorized, getIsHydrated } from "./redux/reducers/authReducer";
import { getProfile } from "./redux/reducers/profileReducer";

const App = () => {
  const { theme } = useDarkMode();
  const themeMode = theme === ThemeTypes.light ? lightTheme : darkTheme;
  const profile = useSelector(getProfile);

  const dispatch = useDispatch();

  const authorized = useSelector(getIsAuthorized);
  const hydrated = useSelector(getIsHydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (authorized) {
      dispatch(getMyProfileServer());
    } else {
      Sentry.setUser(null);
    }
  }, [authorized, hydrated]);

  useEffect(() => {
    if (authorized && hydrated && profile.email) {
      Sentry.setUser({ email: profile.email });
    }
  }, [authorized, hydrated, profile]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.noticeable.render("widget", "HhSbAWQvk90PptShlFTC");
  });

  return (
    <>
      <ThemeProvider theme={themeMode}>
        <Router />
      </ThemeProvider>
    </>
  );
};

export default App;
