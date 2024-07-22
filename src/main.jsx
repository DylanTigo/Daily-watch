import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Favorites from "./Pages/Favorites.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import Films from "./Pages/Films.jsx";
import Series from "./Pages/Series.jsx";
import Details from "./Pages/Details.jsx";
// import Home from "./Pages/Home.jsx";
import "./index.css"
import App from "./App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/films",
    element: <Films />,
  },
  {
    path: "/fimls/:id",
    element: <Favorites />,
  },
  {
    path: "/series",
    element: <Series />,
  },
  {
    path: "/:type/details/:id",
    element: <Details />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "*",
    element: <NotFoundPage/>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
