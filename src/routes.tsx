import { BrowserRouter, Route, Routes } from "react-router-dom";

import { pages } from "./lib/routeUtils";

import NavigateSetter from "./lib/NavigateSetter";
import HomePage from "./modules/Home";
import MyStudio from "./modules/MyStudio";
import RecoverPassword from "./modules/RecoverPassword";
import Settings from "./modules/Settings";
import SignIn from "./modules/SignIn";
import SignUp from "./modules/SignUp";

import AppDialogs from "./components/AppPopups/AppPopups";
import ActorPage from "./modules/Actors/ActorPage";
import AIAvatar from "./modules/AIAvatar";
import AIHumansPage from "./modules/AIHumans";
import AIVideo from "./modules/AIVideo";
import ApiAccess from "./modules/ApiAccess";
import Project from "./modules/Project";
import ResetPassword from "./modules/ResetPassword";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path={pages.main()} element={<HomePage />} />
      <Route path={pages.actors()} element={<ActorPage />} />
      <Route path="/actors?projectId=:id" element={<ActorPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signup?token=:token" element={<SignUp />} />
      <Route path={pages.signIn()} element={<SignIn />} />
      <Route path={pages.recoverPassword()} element={<RecoverPassword />} />
      <Route path={pages.resetPassword()} element={<ResetPassword />} />
      <Route path={pages.apiAccess()} element={<ApiAccess />} />
      <Route path={pages.settings()} element={<Settings />} />
      <Route path={pages.myStudio()} element={<MyStudio />} />
      <Route path={pages.aiHumans()} element={<AIHumansPage />} />
      <Route path={pages.aiHumansProject()} element={<AIHumansPage />} />
      <Route path={pages.aiVideo()} element={<AIVideo />} />
      <Route path={pages.aiAvatar()} element={<AIAvatar />} />
      <Route path={pages.project()} element={<Project />} />
    </Routes>
    <NavigateSetter />
    <AppDialogs />
  </BrowserRouter>
);

export default Router;
