import { authStateType } from "../redux/reducers/authReducer";
import { tokensStateType } from "../redux/reducers/tokensReducer";
import { profileStateType } from "../redux/reducers/profileReducer";
import { actorStateType } from "../redux/reducers/actorReducer";
import { popupsStateType } from "../redux/reducers/popupsReducer";
import { projectStateType } from "../redux/reducers/projectReducer";
import { themeStateType } from "../redux/reducers/themeReducer";
import { chatStateType } from "../redux/reducers/chatReducer";

export interface StoreType {
  auth: authStateType;
  tokens: tokensStateType;
  profile: profileStateType;
  actor: actorStateType;
  popups: popupsStateType;
  project: projectStateType;
  theme: themeStateType;
  chat: chatStateType;
}
