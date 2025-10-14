import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import ProjectList from "../pages/ProjectList";
import { ProjectDetail } from "../pages/ProjectDetail";
import ProtectedRoute from "./ProtectedRoute";
import MyTask from "../pages/MyTask"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/app",
        element: <MainLayout />,
        children: [
          { path: "project", element: <ProjectList /> },
          { path: "projects/:id", element: <ProjectDetail /> },
          { path: "allTask", element: <MyTask /> },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
