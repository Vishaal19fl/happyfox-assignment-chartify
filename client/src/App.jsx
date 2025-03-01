import "./app.scss";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ThemeProvider } from '@mui/material/styles';
import { useMode, ColorModeContext } from './theme';
import { Profile } from "./pages/profile/Profile";
import NotFound from "./pages/notFound/NotFound";
import { Landing } from "./pages/landing/Landing";
import Team from "./scenes/team/index"
import ChartPage from "./pages/chartPage/ChartPage";

function App() {
  const queryClient = new QueryClient();
  const [theme, colorMode] = useMode();

  
 

  const Layout = () => {
    const navigate = useNavigate();

  return (
    <div className="app">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <Outlet />
            <Footer />
            
          </QueryClientProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
};
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },

        {
          path: "/profile",
          element: <Profile />,
        },

        {
          path: "/chart-page",
          element: <ChartPage />,
        },

        {
          path: '/not-found',
          element: <NotFound />,
        },
       
        {
          path: '/landing',
          element: <Landing />,
        },
    
        {
          path: '/team',
          element: <Team />,
        },

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
