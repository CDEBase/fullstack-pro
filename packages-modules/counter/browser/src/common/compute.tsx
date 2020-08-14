import * as React from "react";
import { IMenuPosition } from "@common-stack/client-react";

import { withAuthenticationRequired } from "@auth0/auth0-react";

import { Home } from "../common/components/Home";
import LoginForm from "../autho/login";
import Profile from "../autho/profile";
import LogoutButton from "../autho/logout-button";
import { getFilteredMenus, getFilteredRoutes } from "../utils";

export const commonPageStore: any[] = [
  {
    path: "/",
    key: "home",
    exact: true,
    name: "Home",
    component: Home,
    position: IMenuPosition.MIDDLE,
  },
  {
    path: "/login",
    key: "login",
    exact: true,
    name: "Login",
    component: LoginForm,
    position: IMenuPosition.MIDDLE,
  },
  {
    path: "/login-complete",
    key: "profile",
    exact: true,
    name: "profile",
    position: IMenuPosition.MIDDLE,
    component: Profile,
  },
  {
    path: "/logout",
    key: "logout",
    exact: true,
    name: "logout", 
    component: LogoutButton,
    position: IMenuPosition.MIDDLE,
  },
];

const selectedRoutesAndMenus = ["home", "login", "profile", "logout"];

// get menus
const filteredMenus = getFilteredMenus(commonPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(
  commonPageStore,
  selectedRoutesAndMenus
);

export { filteredMenus, filteredRoutes };
