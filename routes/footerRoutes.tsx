import React from "react";
import { dashboardPagesMenu, demoPagesMenu, pageLayoutTypesPagesMenu } from "../menu";
import DefaultFooter from "../pages/_layout/_footers/DefaultFooter";

const footers = [
  { path: pageLayoutTypesPagesMenu.blank.path, element: null, exact: true },
  {
    path: pageLayoutTypesPagesMenu.CreateProject.path,
    element: null,
    exact: true,
  },
  { path: pageLayoutTypesPagesMenu.project.path, element: null, exact: true },
  {
    path: pageLayoutTypesPagesMenu.projectDetails.path,
    element: null,
    exact: true,
  },
  {
    path: demoPagesMenu.login.path,
    element: null,
  },
  // { path: demoPagesMenu.login.path, element: null, exact: true },
  // { path: demoPagesMenu.signUp.path, element: null, exact: true },
  // { path: demoPagesMenu.page404.path, element: null, exact: true },
  // { path: demoPagesMenu.knowledge.subMenu.grid.path, element: null, exact: true },
  { path: dashboardPagesMenu.dashboard.path, element: null },
  {
    path: `${pageLayoutTypesPagesMenu.project.path}/*`,
    element: null,
  },
  { path: "/*", element: <DefaultFooter />, exact: true },
];

export default footers;
