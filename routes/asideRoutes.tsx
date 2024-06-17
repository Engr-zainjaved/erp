import { dashboardPagesMenu, demoPagesMenu, pageLayoutTypesPagesMenu } from "../menu";
import DefaultAside from "../pages/_layout/_asides/DefaultAside";
import ProjectDetailAside from "../pages/_layout/_asides/ProjectDetailAside";

const asides = [
  // { path: demoPagesMenu.login.path, element: null, exact: true },
  // { path: demoPagesMenu.signUp.path, element: null, exact: true },
  { path: pageLayoutTypesPagesMenu.blank.path, element: null, exact: true },
  {
    path: pageLayoutTypesPagesMenu.CreateProject.path,
    element: null,
    exact: true,
  },
  { path: pageLayoutTypesPagesMenu.project.path, element: null, exact: true },
  { path: dashboardPagesMenu.dashboard.path, element: null },
  {
    path: demoPagesMenu.login.path,
    element: null,
  },
  {
    path: `${pageLayoutTypesPagesMenu.project.path}/[name]/builds`,
    element: null,
  },
  {
    path: `${pageLayoutTypesPagesMenu.project.path}/[name]/settings`,
    element: null,
  },
  {
    path: `${pageLayoutTypesPagesMenu.project.path}/*`,
    element: <DefaultAside />,
  },
];

export default asides;
