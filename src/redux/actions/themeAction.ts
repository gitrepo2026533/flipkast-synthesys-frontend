import { ThemeTypes } from "../../types/theme";

export const UPDATE_THEME = "UPDATE_THEME";

interface UpdateThemeProps {
  theme: ThemeTypes;
}

export const updateTheme = ({ theme }: UpdateThemeProps) => ({
  type: UPDATE_THEME,
  payload: {
    theme,
  },
});
