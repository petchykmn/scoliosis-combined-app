import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Cover } from "./components/Cover";
import { Overview } from "./components/Overview";
import { Instructions } from "./components/Instructions";
import { Upload } from "./components/Upload";
import { Analysis } from "./components/Analysis";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Cover },
      { path: "overview", Component: Overview },
      { path: "instructions", Component: Instructions },
      { path: "upload", Component: Upload },
      { path: "analysis", Component: Analysis },
    ],
  },
], {basename: '/scoliosis'});
