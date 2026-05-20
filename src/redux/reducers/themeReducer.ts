import { REHYDRATE } from "redux-persist";

import { StoreType } from "../../types/store";
import { ThemeTypes } from "../../types/theme";
import { UPDATE_THEME } from "../actions/themeAction";

export interface themeStateType {
  theme: ThemeTypes;
}

export const themeInitialState = {
  theme: ThemeTypes.light,
};

const themeReducer = (state = themeInitialState, action: any) => {
  switch (action.type) {
    case REHYDRATE: {
      const data = action.payload;
      if (data) {
        return {
          ...state,
          ...data.theme,
        };
      }
      return { ...state };
    }
    case UPDATE_THEME: {
      const { theme } = action.payload;
      return { ...state, theme };
    }
    default:
      return { ...state };
  }
};

export const getTheme = (state: StoreType) => state.theme.theme;

export default themeReducer;
