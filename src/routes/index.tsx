import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";

import VoidLayout from "@/layouts/Void";
import DefaultLayout from "@/layouts/Default";

import Auth from "@/components/common/Auth";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { ErrorPage } from "pages/error-page";
import Homepage from "@/pages/Homepage";
import VideoCall from "@/pages/VideoCall";
import RegisterSuccess from "@/pages/RegisterSuccess";
import WaitingRoomPage from "@/pages/WaitingRoom";
import RoomLayout from "@/layouts/Room";
import { MyProfile } from "@/pages/my-profile";
import { Paths } from "@/constants/path";
import MainLayout from "@/layouts/MainLayout";
import { SchedulePage } from "@/pages/schedule-page";
import { RemoveMeeting } from "@/pages/RemoveMeeting";
import { RemovedPeer } from "@/pages/RemovedPeer";

export const routes: RouteObject[] = [
  {
    element: <VoidLayout />,
    children: [
      {
        element: <RoomLayout />,
        children: [
          {
            element: <DefaultLayout />,
            children: [
              {
                path: Paths.RegisterSuccess,
                element: <RegisterSuccess />,
              },
              {
                element: <MainLayout />,
                children: [
                  {
                    path: Paths.Login,
                    element: <Login />,
                  },
                  {
                    path: Paths.Register,
                    element: <Register />,
                  },
                ],
              },
              {
                path: Paths.Home,
                element: <MainLayout />,
                errorElement: <Navigate to={Paths.Error} />,
                children: [
                  {
                    index: true,
                    element: <Homepage />,
                  },
                ],
              },
              {
                path: Paths.MyProfile,
                element: <Auth unAuthElement={<MainLayout />} />,
                errorElement: <Navigate to={Paths.Error} />,
                children: [
                  {
                    index: true,
                    element: <MyProfile />,
                  },
                ],
              },
              {
                path: Paths.SchedulePageWithoutId,
                element: <Auth unAuthElement={<MainLayout />} />,
                errorElement: <Navigate to={Paths.Error} />,
                children: [
                  {
                    index: true,
                    element: <SchedulePage />,
                  },
                  {
                    path: Paths.SchedulePage,
                    element: <SchedulePage />,
                  },
                ],
              },
              {
                path: Paths.WaitingRoom,
                element: <WaitingRoomPage />,
              },

              {
                path: Paths.RemoveMeeting,
                element: <RemoveMeeting />,
              },

              {
                path: Paths.RemovedPeer,
                element: <RemovedPeer />,
              },

              {
                path: Paths.Error,
                element: <ErrorPage />,
              },
            ],
          },
          {
            path: Paths.VideoCallWithoutId,
            element: <Navigate to={Paths.Home} />,
          },
          {
            path: Paths.VideoCall,
            element: <VideoCall />,
          },
          {
            path: Paths.WaitingRoomWithoutId,
            element: <Navigate to={Paths.Home} />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
