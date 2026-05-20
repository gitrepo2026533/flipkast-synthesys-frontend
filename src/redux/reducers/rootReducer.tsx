import { combineReducers } from "redux";

import authReducer from "./authReducer";
import tokensReducer from "./tokensReducer";
import profileReducer from "./profileReducer";
import actorReducer from "./actorReducer";
import popupsReducer from "./popupsReducer";
import projectReducer from "./projectReducer";
import themeReducer from "./themeReducer";
import chatReducer from "./chatReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  tokens: tokensReducer,
  profile: profileReducer,
  actor: actorReducer,
  popups: popupsReducer,
  project: projectReducer,
  theme: themeReducer,
  chat: chatReducer,
});

export default rootReducer;
