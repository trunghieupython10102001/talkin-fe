import type { types } from "mediasoup-client";
import type { IConsumer, IDataProducer } from "./store";

type TServerBroadcastNewPeer = {
  method: "newPeer";
  data: { id: string; displayName: string; device: string; isGuest: boolean };
};

type TServerBroadcastPeerClosed = {
  method: "peerClosed";
  data: { peerId: string };
};

type TServerBroadcastActiveSpeaker = {
  method: "activeSpeaker";
  data: { peerId: string; volume: number } | { peerId: null };
};

type TServerBroadcastStartRecording = {
  method: "startRecord";
  data: {
    avatarUrl: string;
    device: string;
    displayName: string;
    id: string;
    isHost: boolean;
  };
};

type TServerBroadcastStopRecording = {
  method: "stopRecording";
  data: {
    avatarUrl: string;
    device: string;
    displayName: string;
    id: string;
    isHost: boolean;
  };
};

type TServerBroadcastDownlinkBwe = {
  method: "downlinkBwe";
  data: {};
};

type TServerBroadcastProducerScore = {
  method: "producerScore";
  data: { producerId: string; score: number };
};

type TServerBroadcastConsumerClosed = {
  method: "consumerClosed";
  data: { consumerId: string };
};

type TServerBroadcastConsumerPaused = {
  method: "consumerPaused";
  data: { consumerId: string };
};

type TServerBroadcastConsumerResumed = {
  method: "consumerResumed";
  data: { consumerId: string };
};

type TServerBroadcastConsumerScore = {
  method: "consumerScore";
  data: { consumerId: string; score: number };
};

type TServerBroadcastConsumerLayersChanged = {
  method: "consumerLayersChanged";
  data: { consumerId: string; spatialLayer: number | null; temporalLayer: number | null };
};

type TServerBroadcastDataConsumerClosed = {
  method: "dataConsumerClosed";
  data: { dataConsumerId: string };
};

type TServerBroadcastMessageChat = {
  method: "chat";
  data: {
    peerId: string;
    content: string;
    sentAt: string;
    displayName?: string;
    avatarUrl?: string;
  };
};

type TServerBroadcastEndLivestream = {
  method: "endstream";
  data: {};
};

type TServerBroadcastRoomStatusUpdated = {
  method: "roomStatusUpdated";
  data: {
    id: string;
    numberOfViewers: number;
    status: string;
  };
};

type TServerBroadcastKicked = {
  method: "kicked";
  data: {
    peerId: string;
  };
};

type TServerBroadcastRemovedPeer = {
  method: "removedPeer";
  data: {
    peerId: string;
    displayName: string;
  };
};

type TServerBroadcastMuted = {
  method: "muted";
  data: {
    peerId: string;
  };
};

export interface IServerToClientEvents {
  notification(
    event:
      | TServerBroadcastNewPeer
      | TServerBroadcastPeerClosed
      | TServerBroadcastActiveSpeaker
      | TServerBroadcastDownlinkBwe
      | TServerBroadcastProducerScore
      | TServerBroadcastConsumerClosed
      | TServerBroadcastConsumerPaused
      | TServerBroadcastConsumerResumed
      | TServerBroadcastConsumerScore
      | TServerBroadcastConsumerLayersChanged
      | TServerBroadcastDataConsumerClosed
      | TServerBroadcastMessageChat
      | TServerBroadcastEndLivestream
      | TServerBroadcastRoomStatusUpdated
      | TServerBroadcastKicked
      | TServerBroadcastRemovedPeer
      | TServerBroadcastMuted
      | TServerBroadcastStartRecording
      | TServerBroadcastStopRecording
  ): void;

  newConsumer(event: {
    peerId: string;
    producerId: string;
    id: string;
    kind: "audio" | "video" | undefined;
    rtpParameters: IConsumer["rtpParameters"];
    type: string;
    appData: any;
    producerPaused: IConsumer["remotelyPaused"];
  }): void;

  newDataConsumer(event: {
    peerId: null | string;
    dataProducerId: string;
    id: string;
    sctpStreamParameters: IDataProducer["sctpStreamParameters"];
    label: IDataProducer["label"];
    protocol: IDataProducer["protocol"];
    appData: any;
  }): void;
}

type TClientEmitJoinRoom = {
  method: "join";
  data: {
    displayName: string;
    device: string;
    rtpCapabilities?: types.RtpCapabilities;
    sctpCapabilities?: types.SctpCapabilities;
  };
  response: { peers: Array<{ id: string; displayName: string; device: string }> };
};

type TClientEmitGetRouterRTPCapabilities = {
  method: "getRouterRtpCapabilities";
  data: {};
  response: {
    codecs: {
      kind: "audio" | "video";
      mimeType: string;
      clockRate: number;
      channels: number;
      rtcpFeedback: {
        type: string;
        parameter: string;
      }[];
      parameters: object;
      preferredPayloadType?: number;
    }[];
    headerExtensions: {
      kind: "audio" | "video";
      uri: string;
      preferredId: number;
      preferredEncrypt: boolean;
      direction: "sendrecv" | "recvonly";
    }[];
  };
};

type TClientEmitCreateWebRTCTransport = {
  method: "createWebRtcTransport";
  data: {
    forceTcp: boolean;
    producing: boolean;
    consuming: boolean;
    sctpCapabilities?: types.SctpCapabilities;
  };
  response: {
    params: {
      id: string;
      iceParameters: types.IceParameters;
      iceCandidates: types.IceCandidate[];
      dtlsParameters: types.DtlsParameters;
      sctpParameters: types.SctpParameters;
    };
    type: any;
  };
};

type TClientEmitConnectWebRtcTransport = {
  method: "connectWebRtcTransport";
  data: {
    transportId: types.Transport["id"];
    dtlsParameters: types.DtlsParameters;
  };
  response: boolean;
};

type TClientEmitProduce = {
  method: "produce";
  data: { userId: string | number; rtpParameters: types.RtpParameters; kind: "video" | "audio" };
  response: void;
};

type TClientEmitConsume = {
  method: "consume";
  data: {
    userId: string | number;
    targetId: string | number;
    rtpCapabilities: types.RtpCapabilities;
    kind: "video" | "audio";
  };
  response: void;
};

type TClientEmitStopLivestream = {
  method: "stopLivestream";
  data: {};
  response: void;
};

type TClientSocket =
  | TClientEmitJoinRoom
  | TClientEmitGetRouterRTPCapabilities
  | TClientEmitCreateWebRTCTransport
  | TClientEmitConnectWebRtcTransport
  | TClientEmitProduce
  | TClientEmitConsume
  | TClientEmitStopLivestream;

export interface IClientToServerEvents {
  webrtc(event: Omit<TClientSocket, "response">): Pick<TClientEmitJoinRoom, "response">;
}

export interface IClientSocketQuery {
  [key: string]: string;
  readonly roomId: string;
  readonly device: string;
  readonly isLivestreamRoom: string;
}
