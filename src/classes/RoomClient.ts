import { notify } from "@/store/thunks/notify";
import {
  IDeviceInfo,
  IExtendHTMLVideoElement,
  IWebcam,
  EScreenShareOptions,
  IMessage,
  EDrawerType,
  EStatusLivestream,
} from "interfaces/type";
import * as mediasoupClient from "mediasoup-client";
import * as e2e from "utils/e2e";
import Logger from "./Logger";
import { IRoomClientInitOptions } from "interfaces/roomClient";
import { store as reduxStore } from "store";
import { roomActions } from "store/roomSlice";
import { consumerActions } from "store/consumerSlice";
import { dataConsumerActions } from "store/dataConsumerSlice";
import { peersActions } from "store/peersSlice";
import { producerActions } from "store/producerSlice";
import { notificationActions } from "store/notificationSlice";
import { userActions } from "store/userSlice";
import * as cookiesManager from "utils/cookiesManager";
import { dataProducerActions } from "store/dataProducersSlice";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { IClientToServerEvents, IServerToClientEvents } from "@/interfaces/socket";
import { socketFactory } from "./SocketFactory";
import moment from "moment";
import { ENOTIFY_TYPE, SESSION_STORAGE_KEY } from "@/constants";

const logger = new Logger("RoomClient");

const EXTERNAL_VIDEO_SRC = "/";
const PC_PROPRIETARY_CONSTRAINTS = {
  // optional : [ { googDscp: true } ]
};
const VIDEO_CONSTRAINS = {
  qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
  vga: { width: { ideal: 640 }, height: { ideal: 480 } },
  hd: { width: { ideal: 1280 }, height: { ideal: 720 } },
};

export default class RoomClient {
  _closed: boolean;
  _displayName: string;
  _device: IDeviceInfo;
  _handlerName: mediasoupClient.types.BuiltinHandlerName;
  _forceTcp: boolean;
  _produce: boolean;
  _consume: boolean;
  _useDataChannel: boolean;
  _forceVP8: boolean;
  _forceH264: boolean;
  _forceVP9: boolean;
  _enableWebcamLayers: boolean;
  _enableSharingLayers: boolean;
  _webcamScalabilityMode: string;
  _sharingScalabilityMode: string;
  _numSimulcastStreams: number;
  _externalVideo: IExtendHTMLVideoElement | null;
  _e2eKey: string;
  _nextDataChannelTestNumber: number;
  _socket!: Socket<IServerToClientEvents, IClientToServerEvents>;
  _mediasoupDevice: mediasoupClient.types.Device | null;
  _sendTransport: mediasoupClient.types.Transport | null;
  _recvTransport: mediasoupClient.types.Transport | null;
  _micProducer: mediasoupClient.types.Producer | null;
  _webcamProducer: mediasoupClient.types.Producer | null;
  _shareProducer: mediasoupClient.types.Producer | null;
  _chatDataProducer: mediasoupClient.types.DataProducer | null;
  _botDataProducer: mediasoupClient.types.DataProducer | null;
  _consumers: Map<string, mediasoupClient.types.Consumer>;
  _dataConsumers: Map<string, mediasoupClient.types.DataConsumer>;
  _webcams: Map<string, MediaDeviceInfo>;
  _microphones: Map<string, MediaDeviceInfo>;
  _speakers: Map<string, MediaDeviceInfo>;
  _externalVideoStream: MediaStream | null;
  _webcam: IWebcam;

  static store: typeof reduxStore;

  static init(data: { store: typeof reduxStore }) {
    this.store = data.store;
  }

  constructor({
    roomId,
    peerId,
    displayName,
    device,
    handlerName,
    forceTcp,
    produce,
    consume,
    datachannel,
    enableWebcamLayers,
    enableSharingLayers,
    webcamScalabilityMode,
    sharingScalabilityMode,
    numSimulcastStreams,
    forceVP8,
    forceH264,
    forceVP9,
    externalVideo,
    e2eKey,
    consumerReplicas,
  }: IRoomClientInitOptions) {
    // Closed flag.
    this._closed = false;

    // Display name.
    this._displayName = displayName;

    // Device info.
    this._device = device;

    // Custom mediasoup-client handler name (to override default browser
    // detection if desired).
    this._handlerName = handlerName;

    // Whether we want to force RTC over TCP.
    this._forceTcp = forceTcp;

    // Whether we want to produce audio/video.
    this._produce = produce;

    // Whether we should consume.
    this._consume = consume;

    // Whether we want DataChannels.
    this._useDataChannel = Boolean(datachannel);

    // Force VP8 codec for sending.
    this._forceVP8 = Boolean(forceVP8);

    // Force H264 codec for sending.
    this._forceH264 = Boolean(forceH264);

    // Force VP9 codec for sending.
    this._forceVP9 = Boolean(forceVP9);

    // Whether simulcast or SVC should be used for webcam.
    this._enableWebcamLayers = Boolean(enableWebcamLayers);

    // Whether simulcast or SVC should be used in desktop sharing.
    this._enableSharingLayers = Boolean(enableSharingLayers);

    // Scalability mode for webcam.
    this._webcamScalabilityMode = webcamScalabilityMode;

    // Scalability mode for sharing.
    this._sharingScalabilityMode = sharingScalabilityMode;

    // Number of simuclast streams for webcam and sharing.
    this._numSimulcastStreams = numSimulcastStreams;

    // External video.
    this._externalVideo = null;

    // Enabled end-to-end encryption.
    this._e2eKey = e2eKey;

    // MediaStream of the external video.
    this._externalVideoStream = null;

    // Next expected dataChannel test number.
    this._nextDataChannelTestNumber = 0;

    if (externalVideo) {
      this._externalVideo = document.createElement("video");
      this._externalVideo.controls = true;
      this._externalVideo.muted = true;
      this._externalVideo.loop = true;
      this._externalVideo.setAttribute("playsinline", "");
      this._externalVideo.src = EXTERNAL_VIDEO_SRC;

      this._externalVideo.play().catch((error) => console.log("_externalVideo", error));
    }

    // Socket instance
    // this._socket = null;

    // mediasoup-client Device instance.
    this._mediasoupDevice = null;

    // mediasoup Transport for sending.
    this._sendTransport = null;

    // mediasoup Transport for receiving.
    this._recvTransport = null;

    // Local mic mediasoup Producer.
    this._micProducer = null;

    // Local webcam mediasoup Producer.
    this._webcamProducer = null;

    // Local share mediasoup Producer.
    this._shareProducer = null;

    // Local chat DataProducer.
    this._chatDataProducer = null;

    // Local bot DataProducer.
    this._botDataProducer = null;

    // mediasoup Consumers.
    this._consumers = new Map();

    // mediasoup DataConsumers.
    this._dataConsumers = new Map();

    // Map of webcam MediaDeviceInfos indexed by deviceId.
    this._webcams = new Map();
    // Map of webcam MediaDeviceInfos indexed by deviceId.
    this._speakers = new Map();
    // Map of webcam MediaDeviceInfos indexed by deviceId.
    this._microphones = new Map();

    // Local Webcam.
    this._webcam = {
      device: null,
      resolution: "hd",
    };

    if (this._e2eKey && e2e.isSupported()) {
      e2e.setCryptoKey("setCryptoKey", this._e2eKey, true);
    }
  }

  get webcams() {
    return this._webcams;
  }

  get microphones() {
    return this._microphones;
  }

  get speakers() {
    return this._speakers;
  }

  async close() {
    logger.debug("close()");

    // Close protoo Peer

    await this.disableWebcam();
    await this.disableMic();

    this._socket?.close();
    this._socket?.removeAllListeners();

    // Close mediasoup Transports.
    if (this._sendTransport) this._sendTransport.close();

    if (this._recvTransport) this._recvTransport.close();

    RoomClient.store.dispatch(roomActions.setRoomState({ state: "closed" }));
  }

  viewerLeaveLSRoom() {
    logger.debug("close()");

    // Close protoo Peer
    this._socket?.close();
    this._socket?.removeAllListeners();

    // Close mediasoup Transports.
    if (this._sendTransport) this._sendTransport.close();

    if (this._recvTransport) this._recvTransport.close();

    RoomClient.store.dispatch(roomActions.setRoomState({ state: "closed" }));
  }

  cancelWaitingRoom() {
    logger.debug("cancelWaitingRoom()");

    this._socket?.close();
    this._socket?.removeAllListeners();
    RoomClient.store.dispatch(roomActions.setRoomState({ state: "closed" }));
  }

  async stopLivestream() {
    try {
      await this.disableWebcam();
      await this.disableMic();

      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("stopLivestream")
      );

      this._socket?.close();
      this._socket?.removeAllListeners();

      // Close mediasoup Transports.
      if (this._sendTransport) this._sendTransport.close();

      if (this._recvTransport) this._recvTransport.close();

      RoomClient.store.dispatch(roomActions.setRoomState({ state: "closed" }));
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          text: "Can't end livestream",
          type: ENOTIFY_TYPE.ERROR,
        })
      );
    }
  }

  async prepareJoin(roomId: string, isError?: boolean, isLivestreamRoom = false) {
    try {
      this._socket = io(socketFactory.getSocketConnectURL(roomId, this._device.name, isLivestreamRoom), {
        secure: true,
        transports: ["websocket"],
        forceNew: true,
        auth: {},
      });

      this._socket.on("connect", () => {
        RoomClient.store.dispatch(userActions.setUserId({ peerId: this._socket["id"] }));
        logger.debug("socket io connect()");
      });

      this._socket.on("connect_error", (error: Error) => {
        logger.debug("socket io connect error, %o", error);
        console.dir(error);
        RoomClient.store.dispatch(
          notify({
            text: "Can't connect to meeting room",
            type: ENOTIFY_TYPE.ERROR,
          })
        );

        RoomClient.store.dispatch(roomActions.setRoomState({ state: "disconnected" }));

        this._socket.close();
      });

      this._socket.on("disconnect", (reason) => {
        logger.debug("socket io disconnect, reason: %s", reason);

        if (reason === "io server disconnect") {
          RoomClient.store.dispatch(roomActions.setRoomState({ state: "disconnected" }));
          this._socket.close();
        } else {
          this.close();
        }
      });

      this._mediasoupDevice = new mediasoupClient.Device({
        handlerName: this._handlerName,
      });

      RoomClient.store.dispatch(roomActions.setRoomState({ state: "connecting" }));

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        // Set ideal video resolution
        video: {
          width: { ideal: 800 },
          height: { ideal: 450 },
        },
      });

      // Bypass audio autoplay policy of chrome
      {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        logger.debug("Prepare join room  audio media: %o", stream);

        const audioTrack = stream.getAudioTracks()[0];

        audioTrack.enabled = false;

        setTimeout(() => audioTrack.stop(), 120);
      }

      RoomClient.store.dispatch(roomActions.setRoomState({ state: "connecting" }));

      // Clean all the existing notifcations.
      RoomClient.store.dispatch(notificationActions.deleteAllNotification());

      return mediaStream;
    } catch (error) {
      logger.debug("Encountered error when prepare join: %o", error);
      this.close();
      throw error;
    }
  }

  async join(guestName?: string, isLivestreamRoom = false) {
    logger.debug("Join() call");
    try {
      if (isLivestreamRoom) {
        this._streamerJoinLivestream();
      } else {
        if (guestName) this._displayName = guestName;
        this._joinRoom();

        this._socket.on("newConsumer", async (request) => {
          if (!this._consume) {
            return;
          }
          const { peerId, producerId, id, kind, rtpParameters, type, appData, producerPaused } = request;

          try {
            const consumer = await this._recvTransport!.consume({
              id,
              producerId,
              kind,
              rtpParameters,
              // NOTE: Force streamId to be same in mic and webcam and different
              // in screen sharing so libwebrtc will just try to sync mic and
              // webcam streams from the same remote peer.
              streamId: `${peerId}-${appData.share ? "share" : "mic-webcam"}`,
              appData: { ...appData, peerId }, // Trick.
            });

            RoomClient.store.dispatch(userActions.setAppData({ ...appData }));

            console.log("new consumber: ", peerId, producerId);

            RoomClient.store.dispatch(userActions.setPresenter({ peerId, producerId }));

            if (this._e2eKey && e2e.isSupported()) {
              e2e.setupReceiverTransform(consumer.rtpReceiver);
            }

            logger.debug("New consumer: %o", consumer);

            // Store in the map.
            this._consumers.set(consumer.id, consumer);

            consumer.on("transportclose", () => {
              logger.debug("consumer closed: %s", consumer.id);
              this._consumers.delete(consumer.id);
            });

            const { spatialLayers, temporalLayers } = mediasoupClient.parseScalabilityMode(
              consumer.rtpParameters.encodings![0].scalabilityMode
            );

            RoomClient.store.dispatch(
              consumerActions.addConsumer({
                consumer: {
                  id: consumer.id,
                  type: type,
                  locallyPaused: false,
                  remotelyPaused: producerPaused,
                  rtpParameters: consumer.rtpParameters,
                  spatialLayers: spatialLayers,
                  temporalLayers: temporalLayers,
                  preferredSpatialLayer: spatialLayers - 1,
                  preferredTemporalLayer: temporalLayers - 1,
                  priority: 1,
                  codec: consumer.rtpParameters.codecs[0].mimeType.split("/")[1],
                  track: consumer.track,
                  appData: {
                    share: appData.share,
                  },
                },
                peerId: peerId,
              })
            );

            // We are ready. Answer the protoo request so the server will
            // resume this Consumer (which was paused for now if video).
            // accept();

            // If audio-only mode is enabled, pause it.
            if (consumer.kind === "video" && RoomClient.store.getState().user.audioOnly) {
              this._pauseConsumer(consumer);
            }
          } catch (error) {
            logger.error('"newConsumer" request failed:%o', error);

            RoomClient.store.dispatch(
              notify({
                type: ENOTIFY_TYPE.ERROR,
                text: `Error creating a Consumer: ${error}`,
              })
            );

            throw error;
          }
        });

        this._socket.on("newDataConsumer", async (request) => {
          if (!this._consume) {
            // reject(403, "I do not want to data consume");
            return;
          }
          if (!this._useDataChannel) {
            // reject(403, "I do not want DataChannels");

            return;
          }

          const {
            peerId, // NOTE: Null if bot.
            dataProducerId,
            id,
            sctpStreamParameters,
            label,
            protocol,
            appData,
          } = request;

          try {
            const dataConsumer = await this._recvTransport!.consumeData({
              id,
              dataProducerId,
              sctpStreamParameters,
              label,
              protocol,
              appData: { ...appData, peerId }, // Trick.
            });

            // Store in the map.
            this._dataConsumers.set(dataConsumer.id, dataConsumer);

            dataConsumer.on("transportclose", () => {
              this._dataConsumers.delete(dataConsumer.id);
            });

            dataConsumer.on("open", () => {
              logger.debug('DataConsumer "open" event');
            });

            dataConsumer.on("close", () => {
              logger.warn('DataConsumer "close" event');

              this._dataConsumers.delete(dataConsumer.id);

              RoomClient.store.dispatch(
                notify({
                  type: ENOTIFY_TYPE.ERROR,
                  text: "DataConsumer closed",
                })
              );
            });

            dataConsumer.on("error", (error) => {
              logger.error('DataConsumer "error" event:%o', error);

              RoomClient.store.dispatch(
                notify({
                  type: ENOTIFY_TYPE.ERROR,
                  text: `DataConsumer error: ${error}`,
                })
              );
            });

            dataConsumer.on("message", (message) => {
              logger.debug('DataConsumer "message" event [streamId:%d]', dataConsumer.sctpStreamParameters.streamId);

              if (message instanceof ArrayBuffer) {
                const view = new DataView(message);
                const number = view.getUint32(0);

                if (number === Math.pow(2, 32) - 1) {
                  logger.warn("dataChannelTest finished!");

                  this._nextDataChannelTestNumber = 0;

                  return;
                }

                if (number > this._nextDataChannelTestNumber) {
                  logger.warn("dataChannelTest: %s packets missing", number - this._nextDataChannelTestNumber);
                }

                this._nextDataChannelTestNumber = number + 1;

                return;
              } else if (typeof message !== "string") {
                logger.warn('ignoring DataConsumer "message" (not a string)');

                return;
              }

              switch (dataConsumer.label) {
                case "chat": {
                  const { peers } = RoomClient.store.getState();
                  const peersArray = Object.keys(peers).map((_peerId) => peers[_peerId]);
                  const sendingPeer = peersArray.find((peer) => peer.dataConsumers.includes(dataConsumer.id));

                  if (!sendingPeer) {
                    logger.warn('DataConsumer "message" from unknown peer');

                    break;
                  }

                  RoomClient.store.dispatch(
                    notify({
                      title: `${sendingPeer.displayName} says:`,
                      text: message,
                      timeout: 5000,
                    })
                  );

                  break;
                }

                case "bot": {
                  RoomClient.store.dispatch(
                    notify({
                      title: "Message from Bot:",
                      text: message,
                      timeout: 5000,
                    })
                  );

                  break;
                }
              }
            });

            RoomClient.store.dispatch(
              dataConsumerActions.addDataConsumer({
                dataConsumer: {
                  id: dataConsumer.id,
                  sctpStreamParameters: dataConsumer.sctpStreamParameters,
                  label: dataConsumer.label,
                  protocol: dataConsumer.protocol,
                },
                peerId: peerId || "",
              })
            );

            // We are ready. Answer the protoo request.
            // accept();
          } catch (error) {
            logger.error('"newDataConsumer" request failed:%o', error);

            RoomClient.store.dispatch(
              notify({
                type: ENOTIFY_TYPE.ERROR,
                text: `Error creating a DataConsumer: ${error}`,
              })
            );

            throw error;
          }
        });
      }
      this._onNotification();
    } catch (error) {
      logger.error("join() | failed: %o", error);
      console.log("Error: ", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: "Failed to connect meeting room",
        })
      );
    }
  }

  async viewerJoinLivestream(roomId: string, isError?: boolean) {
    try {
      this._socket = io(socketFactory.getSocketConnectURL(roomId, this._device.name, true), {
        secure: true,
        transports: ["websocket"],
        auth: {},
      });

      this._socket.on("connect", () => {
        logger.debug("socket io connect()");
      });

      this._socket.on("connect_error", (error: Error) => {
        logger.debug("socket io connect error, %o", error);

        RoomClient.store.dispatch(
          notify({
            text: "Can't connect to meeting room",
            type: ENOTIFY_TYPE.ERROR,
          })
        );

        RoomClient.store.dispatch(roomActions.setRoomState({ state: "disconnected" }));

        this._socket.close();
      });

      this._socket.on("disconnect", (reason) => {
        logger.debug("socket io disconnect, reason: %s", reason);

        if (reason === "io server disconnect") {
          RoomClient.store.dispatch(
            notify({
              text: "Can't connect to server",
              type: ENOTIFY_TYPE.ERROR,
            })
          );
          RoomClient.store.dispatch(roomActions.setRoomState({ state: "disconnected" }));
          this._socket.close();
        } else {
          this.close();
        }
      });

      this._mediasoupDevice = new mediasoupClient.Device({
        handlerName: this._handlerName,
      });

      RoomClient.store.dispatch(roomActions.setRoomState({ state: "connecting" }));

      RoomClient.store.dispatch(notificationActions.deleteAllNotification());

      this._onNotification();

      const routerRtpCapabilities = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("getRouterRtpCapabilities")
      );

      await this._mediasoupDevice!.load({ routerRtpCapabilities });

      if (this._consume) {
        const transportInfo = await this._socket.emitWithAck(
          "webrtc",
          // @ts-ignore
          socketFactory.createSocketEmitRequest("createWebRtcTransport", {
            forceTcp: this._forceTcp,
            producing: false,
            consuming: true,
            sctpCapabilities: this._useDataChannel ? this._mediasoupDevice!.sctpCapabilities : undefined,
          })
        );

        const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = transportInfo;

        this._recvTransport = this._mediasoupDevice!.createRecvTransport({
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters: {
            ...dtlsParameters,
            // Remote DTLS role. We know it's always 'auto' by default so, if
            // we want, we can force local WebRTC transport to be 'client' by
            // indicating 'server' here and vice-versa.
            role: "auto",
          },
          sctpParameters,
          iceServers: [],
          additionalSettings: {
            encodedInsertableStreams: this._e2eKey && e2e.isSupported(),
          },
        });

        this._recvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
          logger.debug("Connected to receive transport");

          this._socket
            .emitWithAck(
              "webrtc",
              // @ts-ignore
              socketFactory.createSocketEmitRequest("connectWebRtcTransport", {
                transportId: this._recvTransport?.id,
                dtlsParameters,
              })
            )
            .then((response: any) => {
              logger.debug("Connect WebRTC transport: %o", response);

              callback();
            })
            .catch((err) => {
              console.log("Connect error ", err);
              errback(err);
            });
        });
      }

      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("join", {
          displayName: this._displayName,
          device: this._device.name,
          rtpCapabilities: this._consume ? this._mediasoupDevice!.rtpCapabilities : undefined,
          sctpCapabilities: this._useDataChannel && this._consume ? this._mediasoupDevice!.sctpCapabilities : undefined,
        })
      );

      this._socket.on("newConsumer", async (request) => {
        if (!this._consume) {
          return;
        }
        const { peerId, producerId, id, kind, rtpParameters, type, appData, producerPaused } = request;

        const consumer = await this._recvTransport!.consume({
          id,
          producerId,
          kind,
          rtpParameters,
          // NOTE: Force streamId to be same in mic and webcam and different
          // in screen sharing so libwebrtc will just try to sync mic and
          // webcam streams from the same remote peer.
          streamId: `${peerId}-${appData.share ? "share" : "mic-webcam"}`,
          appData: { ...appData, peerId }, // Trick.
        });

        RoomClient.store.dispatch(userActions.setAppData(appData));

        if (this._e2eKey && e2e.isSupported()) {
          e2e.setupReceiverTransform(consumer.rtpReceiver);
        }

        logger.debug("New consumer: %o", consumer);

        // Store in the map.
        this._consumers.set(consumer.id, consumer);

        consumer.on("transportclose", () => {
          logger.debug("consumer closed: %s", consumer.id);
          this._consumers.delete(consumer.id);
        });

        const { spatialLayers, temporalLayers } = mediasoupClient.parseScalabilityMode(
          consumer.rtpParameters.encodings![0].scalabilityMode
        );

        RoomClient.store.dispatch(
          consumerActions.addConsumer({
            consumer: {
              id: consumer.id,
              type: type,
              locallyPaused: false,
              remotelyPaused: producerPaused,
              rtpParameters: consumer.rtpParameters,
              spatialLayers: spatialLayers,
              temporalLayers: temporalLayers,
              preferredSpatialLayer: spatialLayers - 1,
              preferredTemporalLayer: temporalLayers - 1,
              priority: 1,
              codec: consumer.rtpParameters.codecs[0].mimeType.split("/")[1],
              track: consumer.track,
            },
            peerId: peerId,
          })
        );

        // We are ready. Answer the protoo request so the server will
        // resume this Consumer (which was paused for now if video).
        // accept();

        // If audio-only mode is enabled, pause it.
        if (consumer.kind === "video" && RoomClient.store.getState().user.audioOnly) {
          this._pauseConsumer(consumer);
        }
      });

      this._socket.on("newDataConsumer", async (request) => {
        if (!this._consume) {
          // reject(403, "I do not want to data consume");
          return;
        }
        if (!this._useDataChannel) {
          // reject(403, "I do not want DataChannels");

          return;
        }

        const {
          peerId, // NOTE: Null if bot.
          dataProducerId,
          id,
          sctpStreamParameters,
          label,
          protocol,
          appData,
        } = request;

        try {
          const dataConsumer = await this._recvTransport!.consumeData({
            id,
            dataProducerId,
            sctpStreamParameters,
            label,
            protocol,
            appData: { ...appData, peerId }, // Trick.
          });

          // Store in the map.
          this._dataConsumers.set(dataConsumer.id, dataConsumer);

          dataConsumer.on("transportclose", () => {
            this._dataConsumers.delete(dataConsumer.id);
          });

          dataConsumer.on("open", () => {
            logger.debug('DataConsumer "open" event');
          });

          dataConsumer.on("close", () => {
            logger.warn('DataConsumer "close" event');

            this._dataConsumers.delete(dataConsumer.id);

            RoomClient.store.dispatch(
              notify({
                type: ENOTIFY_TYPE.ERROR,
                text: "DataConsumer closed",
              })
            );
          });

          dataConsumer.on("error", (error) => {
            logger.error('DataConsumer "error" event:%o', error);

            RoomClient.store.dispatch(
              notify({
                type: ENOTIFY_TYPE.ERROR,
                text: `DataConsumer error: ${error}`,
              })
            );
          });

          dataConsumer.on("message", (message) => {
            logger.debug('DataConsumer "message" event [streamId:%d]', dataConsumer.sctpStreamParameters.streamId);

            if (message instanceof ArrayBuffer) {
              const view = new DataView(message);
              const number = view.getUint32(0);

              if (number === Math.pow(2, 32) - 1) {
                logger.warn("dataChannelTest finished!");

                this._nextDataChannelTestNumber = 0;

                return;
              }

              if (number > this._nextDataChannelTestNumber) {
                logger.warn("dataChannelTest: %s packets missing", number - this._nextDataChannelTestNumber);
              }

              this._nextDataChannelTestNumber = number + 1;

              return;
            } else if (typeof message !== "string") {
              logger.warn('ignoring DataConsumer "message" (not a string)');

              return;
            }

            switch (dataConsumer.label) {
              case "chat": {
                const { peers } = RoomClient.store.getState();
                const peersArray = Object.keys(peers).map((_peerId) => peers[_peerId]);
                const sendingPeer = peersArray.find((peer) => peer.dataConsumers.includes(dataConsumer.id));

                if (!sendingPeer) {
                  logger.warn('DataConsumer "message" from unknown peer');

                  break;
                }

                RoomClient.store.dispatch(
                  notify({
                    title: `${sendingPeer.displayName} says:`,
                    text: message,
                    timeout: 5000,
                  })
                );

                break;
              }

              case "bot": {
                RoomClient.store.dispatch(
                  notify({
                    title: "Message from Bot:",
                    text: message,
                    timeout: 5000,
                  })
                );

                break;
              }
            }
          });

          RoomClient.store.dispatch(
            dataConsumerActions.addDataConsumer({
              dataConsumer: {
                id: dataConsumer.id,
                sctpStreamParameters: dataConsumer.sctpStreamParameters,
                label: dataConsumer.label,
                protocol: dataConsumer.protocol,
              },
              peerId: peerId || "",
            })
          );

          // We are ready. Answer the protoo request.
          // accept();
        } catch (error) {
          logger.error('"newDataConsumer" request failed:%o', error);

          RoomClient.store.dispatch(
            notify({
              type: ENOTIFY_TYPE.ERROR,
              text: `Error creating a DataConsumer: ${error}`,
            })
          );

          throw error;
        }
      });
    } catch (error) {
      logger.error("join() | failed: %o", error);
      console.log("Error: ", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: "Failed to connect meeting room",
        })
      );
    }
  }

  _onNotification() {
    this._socket.on("notification", (notification) => {
      logger.debug('proto "notification" event [method:%s, data:%o]', notification.method, notification.data);

      switch (notification.method) {
        case "producerScore": {
          // const { producerId, score } = notification.data;

          // RoomClient.store.dispatch(
          //   stateActions.setProducerScore(producerId, score)
          // );

          break;
        }

        case "newPeer": {
          const peer = notification.data;
          logger.debug("new Peer: ", peer);

          RoomClient.store.dispatch(
            peersActions.addPeers({
              peer: { ...peer, consumers: [], dataConsumers: [] },
            })
          );

          RoomClient.store.dispatch(
            notify({
              text: `${peer.displayName} just joined the meeting ${peer.isGuest ? "(Guest)" : ""}`,
              type: ENOTIFY_TYPE.JOIN,
            })
          );

          break;
        }

        case "peerClosed": {
          const { peerId } = notification.data;

          RoomClient.store.dispatch(peersActions.removePeer({ peerId }));

          break;
        }

        case "downlinkBwe": {
          logger.debug("'downlinkBwe' event:%o", notification.data);

          break;
        }

        case "consumerClosed": {
          const { consumerId } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          consumer.close();
          this._consumers.delete(consumerId);

          const { peerId } = consumer.appData;

          RoomClient.store.dispatch(
            consumerActions.removeConsumer({
              consumerId,
              peerId: peerId as string,
            })
          );

          break;
        }

        case "consumerPaused": {
          const { consumerId } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          consumer.pause();

          RoomClient.store.dispatch(
            consumerActions.setConsumerPause({
              consumerId,
              originator: "remote",
            })
          );

          break;
        }

        case "consumerResumed": {
          const { consumerId } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          consumer.resume();

          RoomClient.store.dispatch(
            consumerActions.setConsumerResume({
              consumerId,
              originator: "remote",
            })
          );

          break;
        }

        case "consumerLayersChanged": {
          const { consumerId, spatialLayer, temporalLayer } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          RoomClient.store.dispatch(
            consumerActions.setConsumerCurrentLayers({
              consumerId,
              spatialLayer: spatialLayer || 0,
              temporalLayer: temporalLayer || 0,
            })
          );

          break;
        }

        case "consumerScore": {
          const { consumerId, score } = notification.data;

          RoomClient.store.dispatch(consumerActions.setConsumerScore({ consumerId, score }));

          break;
        }

        case "dataConsumerClosed": {
          const { dataConsumerId } = notification.data;
          const dataConsumer = this._dataConsumers.get(dataConsumerId);

          if (!dataConsumer) break;

          dataConsumer.close();
          this._dataConsumers.delete(dataConsumerId);

          const { peerId } = dataConsumer.appData;

          RoomClient.store.dispatch(
            dataConsumerActions.removeDataConsumer({
              dataConsumerId,
              peerId: peerId as string,
            })
          );

          break;
        }

        case "activeSpeaker": {
          const { peerId } = notification.data;

          RoomClient.store.dispatch(roomActions.setRoomActiveSpeaker({ peerId: peerId || "" }));

          break;
        }

        case "startRecord": {
          const { displayName } = notification.data;
          RoomClient.store.dispatch(userActions.setIsRecording({ isRecording: true }));
          RoomClient.store.dispatch(
            notify({
              type: ENOTIFY_TYPE.START_RECORDING,
              title: "has started the recoding",
              userName: displayName,
            })
          );

          break;
        }

        case "stopRecording": {
          RoomClient.store.dispatch(userActions.setIsRecording({ isRecording: false }));
          RoomClient.store.dispatch(
            notify({
              type: ENOTIFY_TYPE.STOP_RECORDING,
              text: "The recording has stopped",
            })
          );

          break;
        }

        case "chat": {
          const { peerId, content, sentAt, displayName } = notification.data;
          const peer = RoomClient.store.getState().peers[peerId];

          const message: IMessage = {
            displayName: peer?.displayName || displayName || peerId,
            content: content,
            sentAt: moment(sentAt).format("hh:mm A"),
          };
          RoomClient.store.dispatch(roomActions.addMessage(message));

          const { isOpen, type } = RoomClient.store.getState().room.drawer;

          if (!isOpen || (isOpen && type !== EDrawerType.CHAT)) {
            const cntMessageUnRead = RoomClient.store.getState().room.cntMessageUnRead;
            RoomClient.store.dispatch(roomActions.setCntMessageUnRead({ count: cntMessageUnRead + 1 }));
            RoomClient.store.dispatch(
              notify({
                type: ENOTIFY_TYPE.MESSAGE,
                title: peer?.displayName || displayName || peerId,
                text: content,
              })
            );
          }
          break;
        }

        case "endstream": {
          RoomClient.store.dispatch(roomActions.setRoomLSInfo({ status: EStatusLivestream.END, peers: 0 }));
          RoomClient.store.dispatch(
            notify({
              type: ENOTIFY_TYPE.INFO,
              text: "The livestream has ended",
            })
          );
          break;
        }

        case "roomStatusUpdated": {
          const { numberOfViewers } = notification.data;
          RoomClient.store.dispatch(roomActions.setNumberOfViewers({ numberOfViewers: numberOfViewers }));
          break;
        }

        case "kicked": {
          if (this._micProducer) {
            this._micProducer.track?.stop();
            this._micProducer.close();
            RoomClient.store.dispatch(producerActions.removeProducer({ producerId: this._micProducer.id }));
          }

          if (this._webcamProducer) {
            this._webcamProducer.track?.stop();
            this._webcamProducer.close();

            RoomClient.store.dispatch(producerActions.removeProducer({ producerId: this._webcamProducer.id }));
          }

          if (this._sendTransport) this._sendTransport.close();

          if (this._recvTransport) this._recvTransport.close();

          break;
        }

        case "removedPeer": {
          const { displayName } = notification.data;

          RoomClient.store.dispatch(
            notify({
              type: ENOTIFY_TYPE.REMOVE,
              text: `${displayName} was removed from the video call`,
            })
          );
          break;
        }

        case "muted": {
          this.muteMic();
          // const { peerId } = notification.data;
          if (!RoomClient.store.getState().user.isHost) {
            RoomClient.store.dispatch(
              notify({
                type: ENOTIFY_TYPE.ERROR,
                text: `You have been muted by the host`,
              })
            );
          }
          break;
        }

        default: {
          logger.error('unknown protoo notification.method "%o"', notification);
        }
      }
    });
  }

  async enableMic() {
    logger.debug("enableMic()");

    if (this._micProducer) return;

    // if (!this._mediasoupDevice!.canProduce('audio')) {
    //   logger.error('enableMic() | cannot produce audio');

    //   return;
    // }

    let track;

    try {
      if (!this._externalVideo) {
        logger.debug("enableMic() | calling getUserMedia()");

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: sessionStorage.getItem(SESSION_STORAGE_KEY.MIC_ID) || "default",
          },
        });

        track = stream.getAudioTracks()[0];
      } else {
        const stream = await this._getExternalVideoStream();

        track = stream!.getAudioTracks()[0].clone();
      }

      this._micProducer = await this._sendTransport!.produce({
        track,
        codecOptions: {
          opusStereo: true,
          opusDtx: true,
          opusFec: true,
          opusNack: true,
        },
        // NOTE: for testing codec selection.
        // codec : this._mediasoupDevice.rtpCapabilities.codecs
        // 	.find((codec) => codec.mimeType.toLowerCase() === 'audio/pcma')
      });

      if (this._e2eKey && e2e.isSupported()) {
        e2e.setupSenderTransform(this._micProducer.rtpSender);
      }

      RoomClient.store.dispatch(
        producerActions.addProducer({
          producer: {
            id: this._micProducer.id,
            paused: this._micProducer.paused,
            track: this._micProducer.track,
            rtpParameters: this._micProducer.rtpParameters,
            codec: this._micProducer.rtpParameters.codecs[0].mimeType.split("/")[1],
          },
        })
      );

      this._micProducer.on("transportclose", () => {
        this._micProducer = null;
      });

      this._micProducer.on("trackended", () => {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: "Microphone disconnected!",
          })
        );

        this.disableMic().catch(() => {});
      });
    } catch (error) {
      logger.error("enableMic() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error enabling microphone: ${error}`,
        })
      );

      if (track) track.stop();
    }
  }

  async disableMic() {
    logger.debug("disableMic()");

    if (!this._micProducer) return;

    this._micProducer.track?.stop();
    this._micProducer.close();

    RoomClient.store.dispatch(producerActions.removeProducer({ producerId: this._micProducer.id }));

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("closeProducer", {
          producerId: this._micProducer.id,
        })
      );
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error closing server-side mic Producer: ${error}`,
        })
      );
    }

    this._micProducer = null;
  }

  async muteMic() {
    logger.debug("muteMic()");

    if (!this._micProducer) return this.enableMic();

    this._micProducer!.pause();

    try {
      const result = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("pauseProducer", {
          producerId: this._micProducer!.id,
        })
      );

      logger.debug("Result: %o", { result });

      RoomClient.store.dispatch(producerActions.setProducerPaused({ producerId: this._micProducer!.id }));
    } catch (error) {
      logger.error("muteMic() | failed: %o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error pausing server-side mic Producer: ${error}`,
        })
      );
    }
  }

  async unmuteMic() {
    logger.debug("unmuteMic()");

    if (!this._micProducer) return this.enableMic();

    this._micProducer?.resume();

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("resumeProducer", {
          producerId: this._micProducer!.id,
        })
      );

      RoomClient.store.dispatch(
        producerActions.setProducerResumed({
          producerId: this._micProducer!.id,
        })
      );
    } catch (error) {
      logger.error("unmuteMic() | failed: %o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error resuming server-side mic Producer: ${error}`,
        })
      );
    }
  }

  async enableWebcam() {
    logger.debug("enableWebcam()");

    if (this._webcamProducer) return;
    else if (this._shareProducer) await this.disableShare();

    // if (!this._mediasoupDevice!.canProduce('video')) {
    //   logger.error('enableWebcam() | cannot produce video');

    //   return;
    // }

    logger.debug("_webcamProducer()");

    let track;
    let device;

    RoomClient.store.dispatch(userActions.setWebcamInProgress({ flag: true }));

    try {
      if (!this._externalVideo) {
        await this._updateWebcams();
        device = this._webcam.device;

        logger.debug("Webcam device: %o", device);

        const { resolution } = this._webcam;

        if (!device) throw new Error("no webcam devices");

        logger.debug("enableWebcam() | calling getUserMedia()");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { ideal: sessionStorage.getItem(SESSION_STORAGE_KEY.CAMERA_ID) || device.deviceId },
            ...VIDEO_CONSTRAINS[resolution],
          },
        });

        track = stream.getVideoTracks()[0];
      } else {
        device = { label: "external video" };

        const stream = await this._getExternalVideoStream();

        track = stream!.getVideoTracks()[0].clone();
      }

      let encodings;
      let codec;
      const codecOptions = {
        videoGoogleStartBitrate: 1000,
      };

      if (this._forceVP8) {
        codec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.mimeType.toLowerCase() === "video/vp8");

        if (!codec) {
          throw new Error("desired VP8 codec+configuration is not supported");
        }
      } else if (this._forceH264) {
        codec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.mimeType.toLowerCase() === "video/h264");

        if (!codec) {
          throw new Error("desired H264 codec+configuration is not supported");
        }
      } else if (this._forceVP9) {
        codec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.mimeType.toLowerCase() === "video/vp9");

        if (!codec) {
          throw new Error("desired VP9 codec+configuration is not supported");
        }
      }

      if (this._enableWebcamLayers) {
        // If VP9 is the only available video codec then use SVC.
        const firstVideoCodec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.kind === "video");

        // VP9 with SVC.
        if ((this._forceVP9 && codec) || firstVideoCodec!.mimeType.toLowerCase() === "video/vp9") {
          encodings = [
            {
              maxBitrate: 5000000,
              scalabilityMode: this._webcamScalabilityMode || "L3T3_KEY",
            },
          ];
        }
        // VP8 or H264 with simulcast.
        else {
          encodings = [
            {
              scaleResolutionDownBy: 1,
              maxBitrate: 5000000,
              scalabilityMode: this._webcamScalabilityMode || "L1T3",
            },
          ];

          if (this._numSimulcastStreams > 1) {
            encodings.unshift({
              scaleResolutionDownBy: 2,
              maxBitrate: 1000000,
              scalabilityMode: this._webcamScalabilityMode || "L1T3",
            });
          }

          if (this._numSimulcastStreams > 2) {
            encodings.unshift({
              scaleResolutionDownBy: 4,
              maxBitrate: 500000,
              scalabilityMode: this._webcamScalabilityMode || "L1T3",
            });
          }
        }
      }

      this._webcamProducer = await this._sendTransport!.produce({
        track,
        encodings,
        codecOptions,
        codec,
      });

      if (this._e2eKey && e2e.isSupported()) {
        e2e.setupSenderTransform(this._webcamProducer.rtpSender);
      }

      RoomClient.store.dispatch(
        producerActions.addProducer({
          producer: {
            id: this._webcamProducer.id,
            deviceLabel: device.label,
            type: this._getWebcamType(device),
            paused: this._webcamProducer.paused,
            track: this._webcamProducer.track,
            rtpParameters: this._webcamProducer.rtpParameters,
            codec: this._webcamProducer.rtpParameters.codecs[0].mimeType.split("/")[1],
          },
        })
      );

      this._webcamProducer.on("transportclose", () => {
        this._webcamProducer = null;
      });

      this._webcamProducer.on("trackended", () => {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: "Webcam disconnected!",
          })
        );

        this.disableWebcam().catch(() => {});
      });
    } catch (error) {
      logger.error("enableWebcam() | failed:%o", error);

      if ((error as Error).name === "NotReadableError") {
        RoomClient.store.dispatch(
          notify({
            text: "Couldn't get your webcam",
            type: ENOTIFY_TYPE.ERROR,
          })
        );
      } else {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: `Error enabling webcam: ${error}`,
          })
        );
      }
      if (track) track.stop();
    }

    RoomClient.store.dispatch(userActions.setWebcamInProgress({ flag: false }));
  }

  async disableWebcam() {
    logger.debug("disableWebcam()");

    if (!this._webcamProducer) return;
    this._webcamProducer.track?.stop();
    this._webcamProducer.close();

    RoomClient.store.dispatch(producerActions.removeProducer({ producerId: this._webcamProducer.id }));

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("closeProducer", {
          producerId: this._webcamProducer.id,
        })
      );
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error closing server-side webcam Producer: ${error}`,
        })
      );
    }

    this._webcamProducer = null;
  }

  async deactiveWebcam() {
    logger.debug("deactiveWebcam()");

    this._webcamProducer!.pause();
    this._webcamProducer?.track?.stop();

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("pauseProducer", {
          producerId: this._webcamProducer!.id,
        })
      );

      RoomClient.store.dispatch(producerActions.setProducerPaused({ producerId: this._webcamProducer!.id }));
    } catch (error) {
      logger.error("deactiveWebcam() | failed: %o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error pausing server-side webcam Producer: ${error}`,
        })
      );
    }
  }

  async activeWebCam() {
    logger.debug("activeWebCam()");

    if (!this._webcamProducer) return this.enableWebcam();
    this._webcamProducer.resume();

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("resumeProducer", {
          producerId: this._webcamProducer!.id,
        })
      );

      if (this._webcam.device) {
        this._webcam.resolution = "hd";
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: this._webcam.device.deviceId },
            ...VIDEO_CONSTRAINS[this._webcam.resolution],
          },
        });

        const track = stream.getVideoTracks()[0];

        await this._webcamProducer!.replaceTrack({ track });

        RoomClient.store.dispatch(
          producerActions.setProducerTrack({
            producerId: this._webcamProducer!.id,
            track,
          })
        );
      }

      RoomClient.store.dispatch(
        producerActions.setProducerResumed({
          producerId: this._webcamProducer!.id,
        })
      );
    } catch (error) {
      logger.error("activeWebCam() | failed: %o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error resuming server-side webcam Producer: ${error}`,
        })
      );
    }
  }

  async changeWebcam() {
    logger.debug("changeWebcam()");

    RoomClient.store.dispatch(userActions.setWebcamInProgress({ flag: true }));

    try {
      await this._updateWebcams();

      const array = Array.from(this._webcams.keys());
      const len = array.length;
      const deviceId = this._webcam.device ? this._webcam.device.deviceId : undefined;
      let idx = array.indexOf(deviceId as string);

      if (idx < len - 1) idx++;
      else idx = 0;

      // @ts-ignore
      this._webcam.device = this._webcams.get(array[idx]);

      logger.debug("changeWebcam() | new selected webcam [device:%o]", this._webcam.device);

      // Reset video resolution to HD.
      this._webcam.resolution = "hd";

      if (!this._webcam.device) throw new Error("no webcam devices");

      // Closing the current video track before asking for a new one (mobiles do not like
      // having both front/back cameras open at the same time).
      this._webcamProducer!.track!.stop();

      logger.debug("changeWebcam() | calling getUserMedia()");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: this._webcam.device.deviceId },
          ...VIDEO_CONSTRAINS[this._webcam.resolution],
        },
      });

      const track = stream.getVideoTracks()[0];

      await this._webcamProducer!.replaceTrack({ track });

      RoomClient.store.dispatch(
        producerActions.setProducerTrack({
          producerId: this._webcamProducer!.id,
          track,
        })
      );
    } catch (error) {
      logger.error("changeWebcam() | failed: %o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Could not change webcam: ${error}`,
        })
      );
    }

    RoomClient.store.dispatch(userActions.setWebcamInProgress({ flag: false }));
  }

  async changeWebcamResolution() {
    logger.debug("changeWebcamResolution()");

    RoomClient.store.dispatch(userActions.setWebcamInProgress({ flag: true }));

    try {
      switch (this._webcam.resolution) {
        case "qvga":
          this._webcam.resolution = "vga";
          break;
        case "vga":
          this._webcam.resolution = "hd";
          break;
        case "hd":
          this._webcam.resolution = "qvga";
          break;
        default:
          this._webcam.resolution = "hd";
      }

      logger.debug("changeWebcamResolution() | calling getUserMedia()");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: this._webcam.device!.deviceId },
          ...VIDEO_CONSTRAINS[this._webcam.resolution],
        },
      });

      const track = stream.getVideoTracks()[0];

      await this._webcamProducer!.replaceTrack({ track });

      RoomClient.store.dispatch(
        producerActions.setProducerTrack({
          producerId: this._webcamProducer!.id,
          track,
        })
      );
    } catch (error) {
      logger.error("changeWebcamResolution() | failed: %o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Could not change webcam resolution: ${error}`,
        })
      );
    }

    RoomClient.store.dispatch(userActions.setWebcamInProgress({ flag: false }));
  }

  async enableShare(displayOptions: EScreenShareOptions = EScreenShareOptions.WINDOW_TAB) {
    logger.debug("enableShare()");

    if (this._shareProducer) return;

    if (!this._mediasoupDevice!.canProduce("video")) {
      logger.error("enableShare() | cannot produce video");

      return;
    }

    let track;

    RoomClient.store.dispatch(userActions.setShareInProgress({ flag: true }));

    try {
      logger.debug("enableShare() | calling getUserMedia()");

      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
          // Note: ts not update this property yet
          // @ts-ignore
          displaySurface: displayOptions,
          // Note: ts not update this property yet
          // @ts-ignore
          logicalSurface: true,
          cursor: true,
          width: { max: 1920 },
          height: { max: 1080 },
          frameRate: { max: 30 },
        },
      });

      // May mean cancelled (in some implementations).
      if (!stream) {
        RoomClient.store.dispatch(userActions.setShareInProgress({ flag: false }));

        return;
      }

      track = stream.getVideoTracks()[0];

      let encodings;
      let codec;
      const codecOptions = {
        videoGoogleStartBitrate: 1000,
      };

      if (this._forceVP8) {
        codec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.mimeType.toLowerCase() === "video/vp8");

        if (!codec) {
          throw new Error("desired VP8 codec+configuration is not supported");
        }
      } else if (this._forceH264) {
        codec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.mimeType.toLowerCase() === "video/h264");

        if (!codec) {
          throw new Error("desired H264 codec+configuration is not supported");
        }
      } else if (this._forceVP9) {
        codec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.mimeType.toLowerCase() === "video/vp9");

        if (!codec) {
          throw new Error("desired VP9 codec+configuration is not supported");
        }
      }

      if (this._enableSharingLayers) {
        // If VP9 is the only available video codec then use SVC.
        const firstVideoCodec = this._mediasoupDevice!.rtpCapabilities.codecs!.find((c) => c.kind === "video");

        // VP9 with SVC.
        if ((this._forceVP9 && codec) || firstVideoCodec!.mimeType.toLowerCase() === "video/vp9") {
          encodings = [
            {
              maxBitrate: 5000000,
              scalabilityMode: this._sharingScalabilityMode || "L3T3",
              dtx: true,
            },
          ];
        }
        // VP8 or H264 with simulcast.
        else {
          encodings = [
            {
              scaleResolutionDownBy: 1,
              maxBitrate: 5000000,
              scalabilityMode: this._sharingScalabilityMode || "L1T3",
              dtx: true,
            },
          ];

          if (this._numSimulcastStreams > 1) {
            encodings.unshift({
              scaleResolutionDownBy: 2,
              maxBitrate: 1000000,
              scalabilityMode: this._sharingScalabilityMode || "L1T3",
              dtx: true,
            });
          }

          if (this._numSimulcastStreams > 2) {
            encodings.unshift({
              scaleResolutionDownBy: 4,
              maxBitrate: 500000,
              scalabilityMode: this._sharingScalabilityMode || "L1T3",
              dtx: true,
            });
          }
        }
      }

      this._shareProducer = await this._sendTransport!.produce({
        track,
        encodings,
        codecOptions,
        codec,
        appData: {
          share: true,
        },
      });

      if (this._e2eKey && e2e.isSupported()) {
        e2e.setupSenderTransform(this._shareProducer.rtpSender);
      }

      RoomClient.store.dispatch(
        producerActions.addProducer({
          producer: {
            id: this._shareProducer.id,
            type: "share",
            paused: this._shareProducer.paused,
            track: this._shareProducer.track,
            rtpParameters: this._shareProducer.rtpParameters,
            codec: this._shareProducer.rtpParameters.codecs[0].mimeType.split("/")[1],
          },
        })
      );

      this._shareProducer.on("transportclose", () => {
        this._shareProducer = null;
      });

      this._shareProducer.on("trackended", () => {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: "Share disconnected!",
          })
        );

        this.disableShare().catch(() => {});
      });
    } catch (error) {
      logger.error("enableShare() | failed:%o", error);
      console.dir(error);
      if ((error as Error).name !== "NotAllowedError") {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: `Error sharing: ${error}`,
          })
        );
      }

      if (track) track.stop();
    }

    RoomClient.store.dispatch(userActions.setShareInProgress({ flag: false }));
  }

  async disableShare() {
    logger.debug("disableShare()");

    if (!this._shareProducer) return;

    this._shareProducer.close();

    RoomClient.store.dispatch(producerActions.removeProducer({ producerId: this._shareProducer.id }));

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("closeProducer", {
          producerId: this._shareProducer.id,
        })
      );
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error closing server-side share Producer: ${error}`,
        })
      );
    }

    this._shareProducer = null;
  }

  async enableAudioOnly() {
    logger.debug("enableAudioOnly()");

    RoomClient.store.dispatch(userActions.setAudioOnlyInProgress({ flag: true }));

    this.disableWebcam();

    for (const consumer of this._consumers.values()) {
      if (consumer.kind !== "video") continue;

      this._pauseConsumer(consumer);
    }

    RoomClient.store.dispatch(userActions.setAudioOnlyState({ enabled: true }));

    RoomClient.store.dispatch(userActions.setAudioOnlyInProgress({ flag: false }));
  }

  async disableAudioOnly() {
    logger.debug("disableAudioOnly()");

    RoomClient.store.dispatch(userActions.setAudioOnlyInProgress({ flag: true }));

    if (!this._webcamProducer && this._produce && (cookiesManager.getDevices() || {}).webcamEnabled) {
      this.enableWebcam();
    }

    for (const consumer of this._consumers.values()) {
      if (consumer.kind !== "video") continue;

      this._resumeConsumer(consumer);
    }

    RoomClient.store.dispatch(userActions.setAudioOnlyState({ enabled: false }));

    RoomClient.store.dispatch(userActions.setAudioOnlyInProgress({ flag: false }));
  }

  async muteAudio() {
    logger.debug("muteAudio()");

    RoomClient.store.dispatch(userActions.setAudioMutedState({ enabled: true }));
  }

  async unmuteAudio() {
    logger.debug("unmuteAudio()");

    RoomClient.store.dispatch(userActions.setAudioMutedState({ enabled: false }));
  }

  async restartIce() {
    logger.debug("restartIce()");

    RoomClient.store.dispatch(userActions.setRestartIceInProgress({ flag: true }));

    try {
      if (this._sendTransport) {
        const iceParameters = await this._socket.emitWithAck(
          "webrtc",
          // @ts-ignore
          socketFactory.createSocketEmitRequest("restartIce", {
            transportId: this._sendTransport.id,
          })
        );

        await this._sendTransport.restartIce({ iceParameters });
      }

      if (this._recvTransport) {
        const iceParameters = await this._socket.emitWithAck(
          "webrtc",
          // @ts-ignore
          socketFactory.createSocketEmitRequest("restartIce", {
            transportId: this._recvTransport.id,
          })
        );

        await this._recvTransport.restartIce({ iceParameters });
      }

      RoomClient.store.dispatch(
        notify({
          text: "ICE restarted",
        })
      );
    } catch (error) {
      logger.error("restartIce() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `ICE restart failed: ${error}`,
        })
      );
    }

    RoomClient.store.dispatch(userActions.setRestartIceInProgress({ flag: false }));
  }

  async setMaxSendingSpatialLayer(spatialLayer: number) {
    logger.debug("setMaxSendingSpatialLayer() [spatialLayer:%s]", spatialLayer);

    try {
      if (this._webcamProducer) await this._webcamProducer.setMaxSpatialLayer(spatialLayer);
      else if (this._shareProducer) await this._shareProducer.setMaxSpatialLayer(spatialLayer);
    } catch (error) {
      logger.error("setMaxSendingSpatialLayer() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error setting max sending video spatial layer: ${error}`,
        })
      );
    }
  }

  async setConsumerPreferredLayers(consumerId: string, spatialLayer: number, temporalLayer: number) {
    logger.debug(
      "setConsumerPreferredLayers() [consumerId:%s, spatialLayer:%s, temporalLayer:%s]",
      consumerId,
      spatialLayer,
      temporalLayer
    );

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("setConsumerPreferredLayers", {
          consumerId,
          spatialLayer,
          temporalLayer,
        })
      );

      RoomClient.store.dispatch(
        consumerActions.setConsumerPreferredLayers({
          consumerId,
          spatialLayer,
          temporalLayer,
        })
      );
    } catch (error) {
      logger.error("setConsumerPreferredLayers() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error setting Consumer preferred layers: ${error}`,
        })
      );
    }
  }

  async setConsumerPriority(consumerId: string, priority: number) {
    logger.debug("setConsumerPriority() [consumerId:%s, priority:%d]", consumerId, priority);

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("setConsumerPriority", {
          consumerId,
          priority,
        })
      );

      RoomClient.store.dispatch(consumerActions.setConsumerPriority({ consumerId, priority }));
    } catch (error) {
      logger.error("setConsumerPriority() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error setting Consumer priority: ${error}`,
        })
      );
    }
  }

  async requestConsumerKeyFrame(consumerId: string) {
    logger.debug("requestConsumerKeyFrame() [consumerId:%s]", consumerId);

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("requestConsumerKeyFrame", { consumerId })
      );

      RoomClient.store.dispatch(
        notify({
          text: "Keyframe requested for video consumer",
        })
      );
    } catch (error) {
      logger.error("requestConsumerKeyFrame() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error requesting key frame for Consumer: ${error}`,
        })
      );
    }
  }

  async enableChatDataProducer() {
    logger.debug("enableChatDataProducer()");

    if (!this._useDataChannel) return;

    // NOTE: Should enable this code but it's useful for testing.
    // if (this._chatDataProducer)
    // 	return;

    try {
      // Create chat DataProducer.
      this._chatDataProducer = await this._sendTransport!.produceData({
        ordered: false,
        maxRetransmits: 1,
        label: "chat",

        // TODO: check this
        // @ts-ignore
        priority: "medium",
        appData: { info: "my-chat-DataProducer" },
      });

      RoomClient.store.dispatch(
        dataProducerActions.addDataProducer({
          dataProducer: {
            id: this._chatDataProducer.id,
            sctpStreamParameters: this._chatDataProducer.sctpStreamParameters,
            label: this._chatDataProducer.label,
            protocol: this._chatDataProducer.protocol,
          },
        })
      );

      this._chatDataProducer.on("transportclose", () => {
        this._chatDataProducer = null;
      });

      this._chatDataProducer.on("open", () => {
        logger.debug('chat DataProducer "open" event');
      });

      this._chatDataProducer.on("close", () => {
        logger.error('chat DataProducer "close" event');

        this._chatDataProducer = null;

        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: "Chat DataProducer closed",
          })
        );
      });

      this._chatDataProducer.on("error", (error) => {
        logger.error('chat DataProducer "error" event:%o', error);

        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: `Chat DataProducer error: ${error}`,
          })
        );
      });

      this._chatDataProducer.on("bufferedamountlow", () => {
        logger.debug('chat DataProducer "bufferedamountlow" event');
      });
    } catch (error) {
      logger.error("enableChatDataProducer() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error enabling chat DataProducer: ${error}`,
        })
      );

      throw error;
    }
  }

  async enableBotDataProducer() {
    logger.debug("enableBotDataProducer()");

    if (!this._useDataChannel) return;

    // NOTE: Should enable this code but it's useful for testing.
    // if (this._botDataProducer)
    // 	return;

    try {
      // Create chat DataProducer.
      this._botDataProducer = await this._sendTransport!.produceData({
        ordered: false,
        maxPacketLifeTime: 2000,
        label: "bot",
        // @ts-ignore
        priority: "medium",
        appData: { info: "my-bot-DataProducer" },
      });

      RoomClient.store.dispatch(
        dataProducerActions.addDataProducer({
          dataProducer: {
            id: this._botDataProducer.id,
            sctpStreamParameters: this._botDataProducer.sctpStreamParameters,
            label: this._botDataProducer.label,
            protocol: this._botDataProducer.protocol,
          },
        })
      );

      this._botDataProducer.on("transportclose", () => {
        this._botDataProducer = null;
      });

      this._botDataProducer.on("open", () => {
        logger.debug('bot DataProducer "open" event');
      });

      this._botDataProducer.on("close", () => {
        logger.error('bot DataProducer "close" event');

        this._botDataProducer = null;

        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: "Bot DataProducer closed",
          })
        );
      });

      this._botDataProducer.on("error", (error) => {
        logger.error('bot DataProducer "error" event:%o', error);

        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: `Bot DataProducer error: ${error}`,
          })
        );
      });

      this._botDataProducer.on("bufferedamountlow", () => {
        logger.debug('bot DataProducer "bufferedamountlow" event');
      });
    } catch (error) {
      logger.error("enableBotDataProducer() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error enabling bot DataProducer: ${error}`,
        })
      );

      throw error;
    }
  }

  async sendChatMessage(text: string) {
    logger.debug('sendChatMessage() [text:"%s]', text);

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("chat", {
          content: text,
        })
      );
    } catch (error) {
      logger.error("chat failed:%o", error);
    }

    // if (!this._chatDataProducer) {
    //   RoomClient.store.dispatch(
    //     notify({
    //       type: "error",
    //       text: "No chat DataProducer",
    //     })
    //   );

    //   return;
    // }

    // try {
    //   this._chatDataProducer.send(text);
    // } catch (error) {
    //   logger.error("chat DataProducer.send() failed:%o", error);

    //   RoomClient.store.dispatch(
    //     notify({
    //       type: "error",
    //       text: `chat DataProducer.send() failed: ${error}`,
    //     })
    //   );
    // }
  }

  async sendBotMessage(text: string) {
    logger.debug('sendBotMessage() [text:"%s]', text);

    if (!this._botDataProducer) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: "No bot DataProducer",
        })
      );

      return;
    }

    try {
      this._botDataProducer.send(text);
    } catch (error) {
      logger.error("bot DataProducer.send() failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `bot DataProducer.send() failed: ${error}`,
        })
      );
    }
  }

  async changeDisplayName(displayName: string) {
    logger.debug('changeDisplayName() [displayName:"%s"]', displayName);

    // Store in cookie.
    cookiesManager.setUser({ displayName });

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("changeDisplayName", { displayName })
      );

      this._displayName = displayName;

      RoomClient.store.dispatch(userActions.setDisplayName({ displayName }));

      RoomClient.store.dispatch(
        notify({
          text: "Display name changed",
        })
      );
    } catch (error) {
      logger.error("changeDisplayName() | failed: %o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Could not change display name: ${error}`,
        })
      );

      // We need to refresh the component for it to render the previous
      // displayName again.
      RoomClient.store.dispatch(userActions.setDisplayName({ displayName: "" }));
    }
  }

  async getSendTransportRemoteStats() {
    logger.debug("getSendTransportRemoteStats()");

    if (!this._sendTransport) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-ignore
      socketFactory.createSocketEmitRequest("getTransportStats", {
        transportId: this._sendTransport.id,
      })
    );
  }

  async getRecvTransportRemoteStats() {
    logger.debug("getRecvTransportRemoteStats()");

    if (!this._recvTransport) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-ignore
      socketFactory.createSocketEmitRequest("getTransportStats", {
        transportId: this._recvTransport.id,
      })
    );
  }

  async getAudioRemoteStats() {
    logger.debug("getAudioRemoteStats()");

    if (!this._micProducer) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-expect-error
      socketFactory.createSocketEmitRequest("getProducerStats", {
        producerId: this._micProducer.id,
      })
    );
  }

  async getVideoRemoteStats() {
    logger.debug("getVideoRemoteStats()");

    const producer = this._webcamProducer || this._shareProducer;

    if (!producer) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-expect-error
      socketFactory.createSocketEmitRequest("getProducerStats", {
        producerId: producer.id,
      })
    );
  }

  async getConsumerRemoteStats(consumerId: string) {
    logger.debug("getConsumerRemoteStats()");

    const consumer = this._consumers.get(consumerId);

    if (!consumer) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-expect-error
      socketFactory.createSocketEmitRequest("getConsumerStats", { consumerId })
    );
  }

  async getChatDataProducerRemoteStats() {
    logger.debug("getChatDataProducerRemoteStats()");

    const dataProducer = this._chatDataProducer;

    if (!dataProducer) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-expect-error
      socketFactory.createSocketEmitRequest("getDataProducerStats", {
        dataProducerId: dataProducer.id,
      })
    );
  }

  async getBotDataProducerRemoteStats() {
    logger.debug("getBotDataProducerRemoteStats()");

    const dataProducer = this._botDataProducer;

    if (!dataProducer) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-expect-error
      socketFactory.createSocketEmitRequest("getDataProducerStats", {
        dataProducerId: dataProducer.id,
      })
    );
  }

  async getDataConsumerRemoteStats(dataConsumerId: string) {
    logger.debug("getDataConsumerRemoteStats()");

    const dataConsumer = this._dataConsumers.get(dataConsumerId);

    if (!dataConsumer) return;

    return this._socket.emitWithAck(
      "webrtc",
      // @ts-expect-error
      socketFactory.createSocketEmitRequest("getDataConsumerStats", { dataConsumerId })
    );
  }

  async getSendTransportLocalStats() {
    logger.debug("getSendTransportLocalStats()");

    if (!this._sendTransport) return;

    return this._sendTransport.getStats();
  }

  async getRecvTransportLocalStats() {
    logger.debug("getRecvTransportLocalStats()");

    if (!this._recvTransport) return;

    return this._recvTransport.getStats();
  }

  async getAudioLocalStats() {
    logger.debug("getAudioLocalStats()");

    if (!this._micProducer) return;

    return this._micProducer.getStats();
  }

  async getVideoLocalStats() {
    logger.debug("getVideoLocalStats()");

    const producer = this._webcamProducer || this._shareProducer;

    if (!producer) return;

    return producer.getStats();
  }

  async getConsumerLocalStats(consumerId: string) {
    const consumer = this._consumers.get(consumerId);

    if (!consumer) return;

    return consumer.getStats();
  }

  async applyNetworkThrottle({
    uplink,
    downlink,
    rtt,
    secret,
    packetLoss,
  }: {
    uplink: number;
    downlink: number;
    rtt: number;
    secret: string;
    packetLoss: number;
  }) {
    logger.debug(
      "applyNetworkThrottle() [uplink:%s, downlink:%s, rtt:%s, packetLoss:%s]",
      uplink,
      downlink,
      rtt,
      packetLoss
    );

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("applyNetworkThrottle", {
          secret,
          uplink,
          downlink,
          rtt,
          packetLoss,
        })
      );
    } catch (error) {
      logger.error("applyNetworkThrottle() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error applying network throttle: ${error}`,
        })
      );
    }
  }

  async resetNetworkThrottle({ silent = false, secret = "" }) {
    logger.debug("resetNetworkThrottle()");

    try {
      await this._socket.emitWithAck(
        "webrtc",
        // @ts-expect-error
        socketFactory.createSocketEmitRequest("resetNetworkThrottle", { secret })
      );
    } catch (error) {
      if (!silent) {
        logger.error("resetNetworkThrottle() | failed:%o", error);

        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: `Error resetting network throttle: ${error}`,
          })
        );
      }
    }
  }

  async _setupMeetingRoomConnection() {
    logger.debug("_prepareJoin()");
    try {
      // Create mediasoup Transport for sending (unless we don't want to produce).
      if (this._produce) {
        // ---
        const transportInfo = await this._socket.emitWithAck(
          "webrtc",
          // @ts-ignore
          socketFactory.createSocketEmitRequest("createWebRtcTransport", {
            forceTcp: this._forceTcp,
            producing: true,
            consuming: false,
            sctpCapabilities: this._useDataChannel ? this._mediasoupDevice!.sctpCapabilities : undefined,
          })
        );

        const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = transportInfo;

        this._sendTransport = this._mediasoupDevice!.createSendTransport({
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters: {
            ...dtlsParameters,
            // Remote DTLS role. We know it's always 'auto' by default so, if
            // we want, we can force local WebRTC transport to be 'client' by
            // indicating 'server' here and vice-versa.
            role: "auto",
          },
          sctpParameters,
          iceServers: [],
          proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
          additionalSettings: {
            encodedInsertableStreams: this._e2eKey && e2e.isSupported(),
          },
        });

        this._sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
          logger.debug("Send transport connected");
          this._socket
            .emitWithAck(
              "webrtc",
              // @ts-ignore
              socketFactory.createSocketEmitRequest("connectWebRtcTransport", {
                transportId: this._sendTransport!.id,
                dtlsParameters,
              })
            )
            .then((response: any) => {
              logger.debug("Connect WebRTC transport: %o", response);

              callback();
            })
            .catch((err) => {
              console.log("Connect error ", err);

              errback(err);
            });
        });

        this._sendTransport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
          try {
            // const { id } = await sendRequest(this._socket, "connectWebRtcTransport", {
            //   transportId: this._sendTransport!.id,
            //   kind,
            //   rtpParameters,
            //   appData,
            // });

            RoomClient.store.dispatch(userActions.setAppData(appData));

            const { id } = await this._socket.emitWithAck(
              "webrtc",
              // @ts-ignore
              socketFactory.createSocketEmitRequest("produce", {
                transportId: this._sendTransport!.id,
                kind,
                rtpParameters,
                appData,
              })
            );

            callback({ id });
          } catch (error) {
            errback(error as Error);
          }
        });
      }

      // Create mediasoup Transport for receiving (unless we don't want to consume).
      if (this._consume) {
        const transportInfo = await this._socket.emitWithAck(
          "webrtc",
          // @ts-ignore
          socketFactory.createSocketEmitRequest("createWebRtcTransport", {
            forceTcp: this._forceTcp,
            producing: false,
            consuming: true,
            sctpCapabilities: this._useDataChannel ? this._mediasoupDevice!.sctpCapabilities : undefined,
          })
        );

        const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = transportInfo;

        this._recvTransport = this._mediasoupDevice!.createRecvTransport({
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters: {
            ...dtlsParameters,
            // Remote DTLS role. We know it's always 'auto' by default so, if
            // we want, we can force local WebRTC transport to be 'client' by
            // indicating 'server' here and vice-versa.
            role: "auto",
          },
          sctpParameters,
          iceServers: [],
          additionalSettings: {
            encodedInsertableStreams: this._e2eKey && e2e.isSupported(),
          },
        });

        this._recvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
          logger.debug("Connected to receive transport");

          this._socket
            .emitWithAck(
              "webrtc",
              // @ts-ignore
              socketFactory.createSocketEmitRequest("connectWebRtcTransport", {
                transportId: this._recvTransport?.id,
                dtlsParameters,
              })
            )
            .then((response: any) => {
              logger.debug("Connect WebRTC transport: %o", response);

              callback();
            })
            .catch((err) => {
              console.log("Connect error ", err);
              errback(err);
            });
        });
      }
    } catch (error) {
      logger.error("_setupMeetingRoomConnection() failed:%o", error);
      throw error;
    }
  }

  async _joinRoom() {
    logger.debug("_joinRoom()");

    try {
      const routerRtpCapabilities = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("getRouterRtpCapabilities")
      );

      await this._mediasoupDevice!.load({ routerRtpCapabilities });

      await this._setupMeetingRoomConnection();

      const { peers, isHost, isRecording, presenter } = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("join", {
          displayName: this._displayName,
          device: this._device.name,
          rtpCapabilities: this._consume ? this._mediasoupDevice!.rtpCapabilities : undefined,
          sctpCapabilities: this._useDataChannel && this._consume ? this._mediasoupDevice!.sctpCapabilities : undefined,
        })
      );

      RoomClient.store.dispatch(roomActions.setRoomState({ state: "connected" }));

      // Clean all the existing notifcations.
      RoomClient.store.dispatch(notificationActions.deleteAllNotification());

      RoomClient.store.dispatch(
        notify({
          text: "You are in the room!",
          timeout: 3000,
          type: ENOTIFY_TYPE.JOIN,
        })
      );

      RoomClient.store.dispatch(userActions.setIsHostMeeting({ isHost: Boolean(isHost) }));
      RoomClient.store.dispatch(userActions.setIsRecording({ isRecording: Boolean(isRecording) }));
      RoomClient.store.dispatch(userActions.setPresenter(presenter));

      for (const peer of peers) {
        RoomClient.store.dispatch(peersActions.addPeers({ peer: { ...peer, consumers: [], dataConsumers: [] } }));
      }

      // Enable mic/webcam.
      if (this._produce) {
        // await Promise.all([this.enableMic(), this.enableWebcam()]);

        // Set our media capabilities.
        RoomClient.store.dispatch(
          userActions.setMediaCapabilities({
            canSendMic: this._mediasoupDevice!.canProduce("audio"),
            canSendWebcam: this._mediasoupDevice!.canProduce("video"),
          })
        );

        const { webCamDisabled, audioMuted } = RoomClient.store.getState().user;

        await this.enableMic();

        if (audioMuted) {
          await this.muteMic();
        }

        if (!webCamDisabled || this._externalVideo) {
          await this.enableWebcam();
        }

        // if (audioMuted) {
        //   logger.debug("Mic is muted");
        //   this.muteMic();
        // }

        // if (webCamDisabled) {
        //   logger.debug("Webcam is turn off");
        //   this.deactiveWebcam();
        // }

        this._sendTransport!.on("connectionstatechange", (connectionState) => {
          logger.debug("Send transport update state %s", connectionState);

          if (connectionState === "connected") {
            // this.enableChatDataProducer();
            // this.enableBotDataProducer();
          }
        });
      }
    } catch (error) {
      logger.error("_joinRoom() failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: "Could not join the room. Please reload the page.",
        })
      );

      this.close();
    }
  }

  async _streamerJoinLivestream() {
    logger.debug("_streamerJoinLivestream()");
    try {
      const routerRtpCapabilities = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("getRouterRtpCapabilities")
      );

      await this._mediasoupDevice!.load({ routerRtpCapabilities });

      await this._setupMeetingRoomConnection();

      await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("join", {
          displayName: this._displayName,
          device: this._device.name,
          rtpCapabilities: this._consume ? this._mediasoupDevice!.rtpCapabilities : undefined,
          sctpCapabilities: this._useDataChannel && this._consume ? this._mediasoupDevice!.sctpCapabilities : undefined,
          isStreamer: true,
        })
      );

      if (this._produce) {
        // await Promise.all([this.enableMic(), this.enableWebcam()]);

        // Set our media capabilities.
        RoomClient.store.dispatch(
          userActions.setMediaCapabilities({
            canSendMic: this._mediasoupDevice!.canProduce("audio"),
            canSendWebcam: this._mediasoupDevice!.canProduce("video"),
          })
        );

        const { webCamDisabled, audioMuted } = RoomClient.store.getState().user;

        await this.enableMic();

        if (audioMuted) {
          await this.muteMic();
        }

        if (!webCamDisabled || this._externalVideo) {
          await this.enableWebcam();
        }

        // if (audioMuted) {
        //   logger.debug("Mic is muted");
        //   this.muteMic();
        // }

        // if (webCamDisabled) {
        //   logger.debug("Webcam is turn off");
        //   this.deactiveWebcam();
        // }

        this._sendTransport!.on("connectionstatechange", (connectionState) => {
          logger.debug("Send transport update state %s", connectionState);

          if (connectionState === "connected") {
            // this.enableChatDataProducer();
            // this.enableBotDataProducer();
          }
        });
      }
    } catch (error) {
      logger.error("_joinRoom() failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: "Could not join the room. Please reload the page.",
        })
      );

      this.close();
    }
  }

  async _updateMediaDeviceSource() {
    logger.debug("_updateMediaDeviceSource()");
    // Reset the list.
    this._webcams = new Map();
    // Reset the list.
    this._microphones = new Map();
    // Reset the list.
    this._speakers = new Map();

    logger.debug("_updateMediaDeviceSource() | calling enumerateDevices()");

    const devices = await navigator.mediaDevices.enumerateDevices();

    logger.debug("Enum devices: %o", devices);

    for (const device of devices) {
      if (device.kind === "videoinput") {
        this._webcams.set(device.deviceId, device);
      } else if (device.kind === "audioinput") {
        this._microphones.set(device.deviceId, device);
      } else {
        this._speakers.set(device.deviceId, device);
      }
    }

    RoomClient.store.dispatch(
      userActions.setMediaDeviceChangable({
        canChangeWebcam: this._webcams.size > 1,
        canChangeMic: this._microphones.size > 1,
        canChangeSpeaker: this._speakers.size > 1,
      })
    );
  }

  async _updateWebcams() {
    logger.debug("_updateWebcams()");

    await this._updateMediaDeviceSource();

    const array = Array.from(this._webcams.values());
    const len = array.length;
    const currentWebcamId = this._webcam.device ? this._webcam.device.deviceId : undefined;

    logger.debug("_updateWebcams() [webcams:%o]", array);

    if (len === 0) {
      this._webcam.device = null;
    } else if (!this._webcams.has(currentWebcamId as string)) {
      this._webcam.device = array[0];
    }

    RoomClient.store.dispatch(userActions.setCanChangeWebcam({ canChangeWebcam: this._webcams.size > 1 }));
  }

  _getWebcamType(device: { label: string }) {
    if (/(back|rear)/i.test(device.label)) {
      logger.debug("_getWebcamType() | it seems to be a back camera");

      return "back";
    } else {
      logger.debug("_getWebcamType() | it seems to be a front camera");

      return "front";
    }
  }

  async _pauseConsumer(consumer: mediasoupClient.types.Consumer<mediasoupClient.types.AppData>) {
    if (consumer.paused) return;

    try {
      consumer.pause();

      RoomClient.store.dispatch(
        consumerActions.setConsumerPause({
          consumerId: consumer.id,
          originator: "local",
        })
      );
    } catch (error) {
      logger.error("_pauseConsumer() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error pausing Consumer: ${error}`,
        })
      );
    }
  }

  async _resumeConsumer(consumer: mediasoupClient.types.Consumer<mediasoupClient.types.AppData>) {
    if (!consumer.paused) return;

    try {
      await this._socket!.emitWithAck(
        "webrtc",
        // @ts-expect-error
        socketFactory.createSocketEmitRequest("resumeConsumer", {
          consumerId: consumer.id,
        })
      );

      consumer.resume();

      RoomClient.store.dispatch(
        consumerActions.setConsumerResume({
          consumerId: consumer.id,
          originator: "local",
        })
      );
    } catch (error) {
      logger.error("_resumeConsumer() | failed:%o", error);

      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Error resuming Consumer: ${error}`,
        })
      );
    }
  }

  async _getExternalVideoStream() {
    if (this._externalVideoStream) return this._externalVideoStream;

    if (this._externalVideo!.readyState < 3) {
      await new Promise((resolve) => this._externalVideo!.addEventListener("canplay", resolve));
    }

    if (this._externalVideo!.captureStream) {
      this._externalVideoStream = this._externalVideo!.captureStream();
    } else if (this._externalVideo!.mozCaptureStream) {
      this._externalVideoStream = this._externalVideo!.mozCaptureStream();
    } else {
      throw new Error("video.captureStream() not supported");
    }

    return this._externalVideoStream;
  }

  async handleRecording(peerId: string) {
    try {
      const data = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("requestRecord", {
          recordingPeerId: peerId,
        })
      );

      if (data) {
        RoomClient.store.dispatch(userActions.setIsRecording({ isRecording: data }));
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.START_RECORDING,
            text: `The recording has started`,
          })
        );
      } else {
        throw new Error();
      }
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: "Internal Server error",
        })
      );
    }
  }

  async handleStopRecording(peerId: string) {
    try {
      const data = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("stopRecord", { recordingPeerId: peerId })
      );

      if (data) {
        RoomClient.store.dispatch(userActions.setIsRecording({ isRecording: false }));
      } else {
        throw new Error();
      }
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Internal Server error`,
        })
      );
    }
  }

  async handleRemovePeerByHost(peerId: string) {
    try {
      const data = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("removePeerByHost", {
          removePeerId: peerId,
        })
      );

      if (!data) {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: `Cannot remove peer`,
          })
        );

        return;
      }
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Cannot remove peer`,
        })
      );
    }
  }

  async handleMuteMicPeer(peerId: string, peerName: string) {
    try {
      const data = await this._socket.emitWithAck(
        "webrtc",
        // @ts-ignore
        socketFactory.createSocketEmitRequest("mutePeer", {
          mutePeerId: peerId,
        })
      );
      if (!data) {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: `Cannot mute mic peer`,
          })
        );

        return;
      } else {
        RoomClient.store.dispatch(
          notify({
            type: ENOTIFY_TYPE.INFO,
            text: `You muted ${peerName} for everyone in the call`,
          })
        );
      }
    } catch (error) {
      RoomClient.store.dispatch(
        notify({
          type: ENOTIFY_TYPE.ERROR,
          text: `Cannot mute mic peer`,
        })
      );
    }
  }
}
