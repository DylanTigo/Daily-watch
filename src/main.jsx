import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import Details from "./pages/Details.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import MyList from "./pages/MyList.jsx";
import NotFound, { RouteError } from "./pages/NotFound.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "films", element: <Browse key="movie" type="movie" /> },
      { path: "series", element: <Browse key="tv" type="tv" /> },
      { path: "film/:id", element: <Details type="movie" /> },
      { path: "serie/:id", element: <Details type="tv" /> },
      { path: "recherche", element: <SearchPage /> },
      { path: "ma-liste", element: <MyList /> },
      { path: "favorites", element: <Navigate to="/ma-liste" replace /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
