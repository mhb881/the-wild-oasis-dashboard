import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, replace, RouterProvider } from "react-router";

import { DarkModeProvider } from "./context/DarkModeContext";
import Account from "./pages/Account";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import CheckIn from "./pages/Checkin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { AppLayout, ProtectedRoute, RouteErrorFallback } from "./ui";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 数据在缓存中保留的时间
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    // 访问/时重定向到/dashboard（replace=true避免历史记录冗余）
    // 布局 + 整体鉴权：所有子页面都需要登录
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        loader: () => replace("/dashboard"),
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/bookings",
        element: <Bookings />,
      },
      {
        path: "/bookings/:bookingId",
        element: <Booking />,
      },
      {
        path: "/checkin/:bookingId",
        element: <CheckIn />,
      },
      {
        path: "/cabins",
        element: <Cabins />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/account",
        element: <Account />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <RouteErrorFallback />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          gutter={12}
          containerClassName={"m-4"}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            className: "text-base",
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
