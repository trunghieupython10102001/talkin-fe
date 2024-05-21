import { useContext, useEffect } from "react";

import { useInvite } from "@/hooks/use-invite";
import { useAppSelector } from "@/hooks/store";
import RoomContext from "@/context/RoomContext";
import { useParams } from "react-router-dom";

export default function useWaitingRoomViewController() {
  const user = useAppSelector((state) => state.user);
  const roomClient = useContext(RoomContext);
  const { roomId: roomID } = useParams();

  const { joinMeeting } = useInvite();

  useEffect(() => {
    if (roomID) {
      joinMeeting(roomID, false);
    }
  }, [joinMeeting, roomID]);

  return {
    user,

    roomClient,
  };
}
