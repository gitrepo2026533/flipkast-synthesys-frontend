import { BrowserRouter, Route, Routes } from "react-router-dom";

import { pages } from "./lib/routeUtils";

import HomePage from "./modules/Home";
import SignIn from "./modules/SignIn";
import SignUp from "./modules/SignUp";
import NavigateSetter from "./lib/NavigateSetter";
import Settings from "./modules/Settings";
import MyStudio from "./modules/MyStudio";
import RecoverPassword from "./modules/RecoverPassword";

import AppDialogs from "./components/AppPopups/AppPopups";
import AIHumansPage from "./modules/AIHumans";
import ResetPassword from "./modules/ResetPassword";
import ActorPage from "./modules/Actors/ActorPage";
import ApiAccess from "./modules/ApiAccess";
import AIVideo from "./modules/AIVideo";
import Project from "./modules/Project";

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
      <Route path={pages.aiVideo()} element={<AIVideo />} />
      <Route path={pages.project()} element={<Project />} />
    </Routes>
    <NavigateSetter />
    <AppDialogs />
  </BrowserRouter>
);

export default Router;
