import React from "react";
import PeerView from "../PeerView";
import { usePeer } from "@/hooks";
import { getImageThumbnail } from "@/utils";

interface IPeerProps {
  id: string;
  handlePin?: (peerId: string) => void;
}

const Peer: React.FC<IPeerProps> = ({ id, handlePin }) => {
  const { peer, audioConsumer, videoConsumer, audioMuted, faceDetection, videoVisible } = usePeer(id);

  return (
    <PeerView
      peer={peer}
      avatarUrl={getImageThumbnail(peer?.avatarUrl)}
      audioConsumerId={audioConsumer ? audioConsumer.id : null}
      videoConsumerId={videoConsumer ? videoConsumer.id : null}
      audioRtpParameters={audioConsumer ? audioConsumer.rtpParameters : null}
      videoRtpParameters={videoConsumer ? videoConsumer.rtpParameters : null}
      consumerSpatialLayers={videoConsumer ? videoConsumer.spatialLayers : null}
      consumerTemporalLayers={videoConsumer ? videoConsumer.temporalLayers : null}
      consumerCurrentSpatialLayer={videoConsumer ? videoConsumer.currentSpatialLayer : null}
      consumerCurrentTemporalLayer={videoConsumer ? videoConsumer.currentTemporalLayer : null}
      consumerPreferredSpatialLayer={videoConsumer ? videoConsumer.preferredSpatialLayer : null}
      consumerPreferredTemporalLayer={videoConsumer ? videoConsumer.preferredTemporalLayer : null}
      consumerPriority={videoConsumer ? videoConsumer.priority : null}
      audioTrack={audioConsumer ? audioConsumer.track : null}
      videoTrack={videoConsumer ? videoConsumer.track : null}
      audioMuted={audioMuted}
      videoVisible={videoVisible}
      videoMultiLayer={videoConsumer && videoConsumer.type !== "simple"}
      audioCodec={audioConsumer ? audioConsumer.codec : null}
      videoCodec={videoConsumer ? videoConsumer.codec : null}
      audioScore={audioConsumer ? audioConsumer.score : null}
      videoScore={videoConsumer ? videoConsumer.score : null}
      faceDetection={faceDetection}
      onHandlePin={handlePin}
    />
  );
};

export default Peer;
