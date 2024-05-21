import RoomContext from "@/context/RoomContext";
import { useAppSelector } from "@/hooks";
import { useContext, useState } from "react";

export const useParticipant = () => {
  const peersObject = useAppSelector((state) => state.peers);
  const me = useAppSelector((state) => state.user);
  const avatarUrl = useAppSelector((state) => state.auth.profile.avatar);
  const roomClient = useContext(RoomContext);
  const peers = Object.values(peersObject);
  const [keySearch, setKeySearch] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPeerRemove, setCurrentPeerRemove] = useState<{ peerId: string; peerName: string }>({
    peerId: "",
    peerName: "",
  });

  const handleCancel = () => {
    setIsOpen(false);
    setCurrentPeerRemove({ peerId: "", peerName: "" });
  };

  const handleOpenDialogConfirmRemovePeer = (peerId: string, peerName: string) => {
    setIsOpen(true);

    setCurrentPeerRemove({
      peerId,
      peerName,
    });
  };

  const handleConfirmRemove = () => {
    roomClient?.handleRemovePeerByHost(currentPeerRemove.peerId);
    setIsOpen(false);
  };

  const handleMuteMicPeer = (peerId: string, peerName: string) => {
    roomClient?.handleMuteMicPeer(peerId, peerName);
  };

  const handleSearchParticipant = (key: string) => {
    setKeySearch(key);
  };

  return {
    me,
    peers,
    roomClient,
    isOpen,
    currentPeerRemove,
    keySearch,
    avatarUrl: `${process.env.REACT_APP_BE_BASE_URL}/${avatarUrl}`,
    handleCancel,
    handleOpenDialogConfirmRemovePeer,
    handleConfirmRemove,
    handleMuteMicPeer,
    handleSearchParticipant,
  };
};
