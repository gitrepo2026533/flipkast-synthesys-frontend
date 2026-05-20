import { useDispatch, useSelector } from "react-redux";

import { updateTheme } from "../redux/actions/themeAction";
import { getTheme } from "../redux/reducers/themeReducer";
import { ThemeTypes } from "../types/theme";

export const useDarkMode = () => {
  const theme = useSelector(getTheme);

  const dispatch = useDispatch();

  const toggleTheme = () => {
    const newTheme = theme === ThemeTypes.light ? ThemeTypes.dark : ThemeTypes.light;
    dispatch(updateTheme({ theme: newTheme }));
  };

  return { theme, toggleTheme };
};
