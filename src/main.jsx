import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Favorites from "./Pages/Favorites.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import Films from "./Pages/Films.jsx";
import Series from "./Pages/Series.jsx";
import Details from "./Pages/Details.jsx";
import Home from "./Pages/Home.jsx";
import "./index.css";
import { QueryClientProvider, QueryClient} from "@tanstack/react-query"
import App from "./App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
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
        element: <NotFoundPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </React.StrictMode>
);
