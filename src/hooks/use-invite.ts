import { useCallback } from "react";

import { useAppDispatch } from "./store";
import { inviteAsynAction } from "@/store/inviteSlice";
import { useNavigate } from "react-router-dom";
import { notify } from "@/store/thunks/notify";
import { AxiosError } from "axios";
import { CodeError } from "@/constants/codeError";
import { ENOTIFY_TYPE } from "@/constants";
import { Paths } from "@/constants/path";

export const useInvite = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const createInviteLink = useCallback(async () => {
    await dispatch(inviteAsynAction.inviteLinkAction());
  }, [dispatch]);

  const joinMeeting = useCallback(
    async (roomId: string, isNavigate = true) => {
      try {
        await dispatch(inviteAsynAction.joinMeetingAction(roomId)).unwrap();

        if (isNavigate) {
          navigate({
            pathname: `/waiting-room/${roomId}`,
          });
        }
      } catch (error: any) {
        const code = error?.response?.data?.message;

        if (code === CodeError.MEETING_ROOM_CANCELLED) {
          dispatch(
            notify({
              type: ENOTIFY_TYPE.ERROR,
              text: "Meeting room cancelled",
            })
          );
          navigate(Paths.Home);
        }

        if (code === CodeError.ROOM_NOT_EXISTED || (error as AxiosError)?.response?.status === 404) {
          dispatch(
            notify({
              type: ENOTIFY_TYPE.ERROR,
              text: "Room ID not existed",
            })
          );

          navigate(Paths.Home);
        }
      }
    },
    [dispatch, navigate]
  );

  return {
    createInviteLink,
    joinMeeting,
  };
};
