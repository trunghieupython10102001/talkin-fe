import React from "react";
import PeerView from "@/components/Views/VideoCall/PeerView";
import { useMeInRoom } from "@/hooks";

interface IComponentProps {
  isLivestream?: boolean;
  handlePin?: (peerId: string) => void;
}

const Me: React.FC<IComponentProps> = ({ isLivestream = false, handlePin }) => {
  const {
    me,
    avatarUrl,
    micState,
    audioProducer,
    videoProducer,
    videoVisible,
    faceDetection,
    handleSetStatsPeerId,
    handleChangeDisplayName,
    handleChangeMaxSendingSpatialLayer,
  } = useMeInRoom();

  return (
    <PeerView
      isLivestream={isLivestream}
      isMe
      peer={me}
      avatarUrl={avatarUrl}
      audioProducerId={audioProducer ? audioProducer.id : null}
      videoProducerId={videoProducer ? videoProducer.id : null}
      audioRtpParameters={audioProducer ? audioProducer.rtpParameters : null}
      videoRtpParameters={videoProducer ? videoProducer.rtpParameters : null}
      audioTrack={audioProducer ? audioProducer.track : null}
      videoTrack={videoProducer ? videoProducer.track : null}
      videoVisible={videoVisible}
      audioCodec={audioProducer ? audioProducer.codec : null}
      videoCodec={videoProducer ? videoProducer.codec : null}
      audioScore={audioProducer ? audioProducer.score : null}
      videoScore={videoProducer ? videoProducer.score : null}
      audioMuted={micState !== "on"}
      faceDetection={faceDetection}
      onChangeDisplayName={handleChangeDisplayName}
      onChangeMaxSendingSpatialLayer={handleChangeMaxSendingSpatialLayer}
      onStatsClick={handleSetStatsPeerId}
      onHandlePin={handlePin}
    />
  );
};

export default Me;
