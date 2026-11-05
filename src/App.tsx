import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import Home from "./pages/Home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUP";
import { Toast } from "@heroui/react";
import NotFound from "./pages/NotFound/NotFound";
import AuthContext from "./Context/authContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Profile from "./pages/Profile/Profile";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import SinglePost from "./pages/SinglePost/SinglePost";
import Settings from "./pages/settings/settings";

let client = new QueryClient();
const router = createBrowserRouter([
  { path: "*", element: <NotFound /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            {" "}
            <Home />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            {" "}
            <Home />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            {" "}
            <Profile />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <ProtectedRoute>
            {" "}
            <SinglePost />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <QueryClientProvider client={client}>
        <AuthContext>
          <RouterProvider router={router} />
          <Toast.Provider placement="top" />
        </AuthContext>
      </QueryClientProvider>
    </>
  );
}
