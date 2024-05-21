import { useAppSelector } from "./store";

export const usePeer = (peerId: string) => {
  const peer = useAppSelector((state) => state.peers[peerId]);
  const consumers = useAppSelector((state) => state.consumer);
  const faceDetection = useAppSelector((state) => state.room.faceDetection);

  const consumersArray = peer?.consumers
    .map((consumerId) => consumers[consumerId])
    .filter((item) => item !== undefined);

  const audioConsumer = consumersArray?.find((consumer) => consumer.track.kind === "audio");
  const videoConsumer = consumersArray?.find((consumer) => consumer.track.kind === "video" && !consumer.appData?.share);

  const videoVisible =
    Boolean(videoConsumer) &&
    videoConsumer !== undefined &&
    !videoConsumer.locallyPaused &&
    !videoConsumer.remotelyPaused;

  const audioVisible =
    Boolean(audioConsumer) &&
    audioConsumer !== undefined &&
    !audioConsumer.locallyPaused &&
    !audioConsumer.remotelyPaused;

  return {
    peer,
    audioConsumer,
    videoConsumer,
    audioMuted: !audioVisible,
    faceDetection,
    videoVisible,
  };
};
