import { useState } from "react";
import RoomContext from "@/context/RoomContext";
import { useAppSelector } from "@/hooks";
import { useContext } from "react";

export const useRecording = () => {
  const roomClient = useContext(RoomContext);
  const [isStartRecording, setStartRecording] = useState<boolean>(false);
  const [isStopRecording, setStopRecording] = useState<boolean>(false);

  const me = useAppSelector((state) => state.user);

  const handleStartRecording = (peerId: string) => {
    roomClient?.handleRecording(peerId);
    setStartRecording(false);
  };

  const handleStopRecording = (peerId: string) => {
    roomClient?.handleStopRecording(peerId);
    setStopRecording(false);
  };

  return {
    isStartRecording,
    isStopRecording,
    setStartRecording,
    setStopRecording,
    handleStartRecording,
    handleStopRecording,
    me,
  };
};
