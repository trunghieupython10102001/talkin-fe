import { Avatar, Box, Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { withStyles } from "@mui/styles";
import { styles } from "./styled";
import hark from "hark";
import Logger from "@/classes/Logger";
import { types } from "mediasoup-client";
import { IUserState as IUser, TAppState } from "@/interfaces/store";
import SoundWave from "@/components/common/SoundWave";
import { MicrophoneOffIcon, PinIcon, UnPinIcon } from "@/assets";
import classNames from "classnames";
import { SESSION_STORAGE_KEY } from "@/constants";
import { connect } from "react-redux";

const logger = new Logger("PeerView");

interface IPeerViewProps {
  isLivestream?: boolean;
  isMe?: boolean;
  peer?: IUser | any;
  avatarUrl?: string;
  audioProducerId?: string | null;
  videoProducerId?: string | null;
  audioRtpParameters?: types.RtpParameters | null;
  videoRtpParameters?: types.RtpParameters | null;
  audioTrack?: MediaStreamTrack | null;
  videoTrack?: MediaStreamTrack | null;
  videoVisible?: boolean;
  audioCodec?: string | null;
  videoCodec?: string | null;

  audioConsumerId?: string | null;
  videoConsumerId?: string | null;
  consumerSpatialLayers?: number | null;
  consumerTemporalLayers?: number | null;
  consumerCurrentSpatialLayer?: number | null;
  consumerCurrentTemporalLayer?: number | null;
  consumerPreferredSpatialLayer?: number | null;
  consumerPreferredTemporalLayer?: number | null;
  consumerPriority?: number | null;
  audioMuted?: boolean;
  videoMultiLayer?: boolean;
  audioScore?: number | null;
  videoScore?: number | null;
  peerPinId?: string;
  isSharingScreen?: boolean;

  onChangeVideoPreferredLayers?: (params1: any, params2: any) => void;
  onChangeVideoPriority?: (params: any) => void;
  onRequestKeyFrame?: () => void;

  onChangeMaxSendingSpatialLayer?: (params: any) => void;
  onStatsClick?: (peerId: string) => void;
  onChangeDisplayName?: (name: string) => void;
  classes?: any;
  faceDetection?: boolean;
  onHandlePin?: (peerId: string) => void;
}

interface IPeerViewStates {
  audioVolume: number;
  videoResolutionWidth: number | null;
  videoResolutionHeight: number | null;
  videoCanPlay: boolean;
  videoElemPaused: boolean;
  maxSpatialLayer: any;
  isBrowserPreventAutoplay: boolean;
}

class PeerView extends React.Component<IPeerViewProps, IPeerViewStates> {
  _audioTrack?: MediaStreamTrack | null;
  _videoTrack?: MediaStreamTrack | null;
  _hark: hark.Harker | null;
  _videoResolutionPeriodicTimer: any;
  _faceDetectionRequestAnimationFrame: any;

  rfVideoElem: React.RefObject<HTMLVideoElement>;
  rfAudioElem: React.RefObject<HTMLAudioElement>;
  rfCanvasElem: React.RefObject<HTMLCanvasElement>;

  constructor(props: IPeerViewProps) {
    super(props);

    this.state = {
      audioVolume: 0, // Integer from 0 to 10.,
      videoResolutionWidth: null,
      videoResolutionHeight: null,
      videoCanPlay: false,
      videoElemPaused: false,
      maxSpatialLayer: null,
      isBrowserPreventAutoplay: false,
    };

    // Latest received video track.
    // @type {MediaStreamTrack}
    this._audioTrack = null;

    // Latest received video track.
    // @type {MediaStreamTrack}
    this._videoTrack = null;

    // Hark instance.
    // @type {Object}
    this._hark = null;

    // Periodic timer for reading video resolution.
    this._videoResolutionPeriodicTimer = null;

    // requestAnimationFrame for face detection.
    this._faceDetectionRequestAnimationFrame = null;

    this.rfVideoElem = React.createRef<HTMLVideoElement>();
    this.rfAudioElem = React.createRef<HTMLVideoElement>();
    this.rfCanvasElem = React.createRef<HTMLCanvasElement>();
  }

  render() {
    const {
      isMe,
      peer,
      isLivestream,
      audioMuted,
      videoVisible,
      peerPinId,
      classes,
      avatarUrl,
      isSharingScreen,
      onHandlePin,
    } = this.props;

    const {
      // videoResolutionWidth,
      // videoResolutionHeight,
      audioVolume,
      // videoCanPlay,
      // videoElemPaused,
      // maxSpatialLayer,
    } = this.state;

    return (
      <Box
        component="div"
        className={classNames(classes.peerView, {
          [classes.peerDisableVideo]: !videoVisible,
          [classes.peerPin]: !isLivestream,
        })}
      >
        {videoVisible ? (
          <video
            className={classes.videoElement}
            ref={this.rfVideoElem}
            autoPlay
            playsInline
            muted={true}
            controls={false}
          />
        ) : (
          <Avatar sx={{ width: peerPinId === "" ? 90 : 65, height: peerPinId === "" ? 90 : 65 }} src={avatarUrl} />
        )}
        <audio
          className={classes.audioElement}
          ref={this.rfAudioElem}
          autoPlay
          playsInline
          muted={isMe || audioMuted}
          controls={false}
        />
        <div className={classes.groupInfo}>
          <Tooltip title={peer?.displayName} style={{ zIndex: 100 }}>
            <div className={classNames(classes.wrapperDisplayName)}>{peer?.displayName}</div>
          </Tooltip>
          <div className={classes.wrapperBoxSound}>
            {audioMuted ? <MicrophoneOffIcon /> : <SoundWave audioVolumn={audioVolume} />}
          </div>
        </div>
        {this.state.isBrowserPreventAutoplay && (
          <div className={classes.browserPreventModal}>
            <div>
              <p>Your browser does not support Video Autoplay</p>
              <Button variant="contained" onClick={this.browserPreventAutoplayHandler}>
                Click to play
              </Button>
            </div>
          </div>
        )}

        <div className="pinIcon">
          <IconButton
            disabled={isSharingScreen}
            onClick={() => {
              if (onHandlePin) onHandlePin(peer.id);
            }}
          >
            {peerPinId === peer.id ? <UnPinIcon /> : <PinIcon />}
          </IconButton>
        </div>
        {/* <canvas ref={this.rfCanvasElem} /> */}
      </Box>
    );
  }

  componentDidMount() {
    const { audioTrack, videoTrack } = this.props;

    if (audioTrack !== null && videoTrack !== null) {
      this._setTracks(audioTrack, videoTrack);
    }
  }

  componentWillUnmount() {
    if (this._hark) this._hark.stop();

    clearInterval(this._videoResolutionPeriodicTimer);
    cancelAnimationFrame(this._faceDetectionRequestAnimationFrame);

    const videoElem = this.rfVideoElem.current;

    if (videoElem) {
      videoElem.oncanplay = null;
      videoElem.onplay = null;
      videoElem.onpause = null;
    }
  }

  UNSAFE_componentWillUpdate() {
    const { isMe, videoRtpParameters } = this.props;

    const { maxSpatialLayer } = this.state;

    if (isMe && videoRtpParameters && videoRtpParameters?.encodings && maxSpatialLayer === null) {
      this.setState({
        maxSpatialLayer: videoRtpParameters?.encodings?.length - 1,
      });
    } else if (isMe && !videoRtpParameters && maxSpatialLayer !== null) {
      this.setState({ maxSpatialLayer: null });
    }
    // console.log("Track video: ", videoTrack);

    // if (audioTrack && videoTrack) {
    //   this._setTracks(audioTrack, videoTrack);
    // }
  }

  componentDidUpdate(prevProps: Readonly<IPeerViewProps>, prevState: Readonly<IPeerViewStates>, snapshot?: any): void {
    const { audioTrack, videoTrack } = this.props;
    if (audioTrack && videoTrack) {
      this._setTracks(audioTrack, videoTrack);
    }
  }

  showBrowserPreventAutoplayModal = () => {
    this.rfVideoElem.current?.pause();
    this.setState({ isBrowserPreventAutoplay: true });
  };

  browserPreventAutoplayHandler = () => {
    this.setState({ isBrowserPreventAutoplay: false });

    const audioElem = this.rfAudioElem.current as HTMLAudioElement;
    const videoElem = this.rfVideoElem.current as HTMLVideoElement;

    audioElem.play();
    videoElem.play();
    audioElem.volume = 1;
    videoElem.volume = 1;
  };

  _setTracks(audioTrack?: MediaStreamTrack, videoTrack?: MediaStreamTrack) {
    // const { faceDetection } = this.props;

    if (this._audioTrack === audioTrack && this._videoTrack === videoTrack) return;

    this._audioTrack = audioTrack;
    this._videoTrack = videoTrack;

    if (this._hark) this._hark.stop();

    this._stopVideoResolution();

    // if (faceDetection) this._stopFaceDetection();

    const audioElem = this.rfAudioElem.current as HTMLAudioElement;
    const videoElem = this.rfVideoElem.current as HTMLVideoElement;

    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      audioElem.srcObject = stream;

      audioElem
        .play()
        .then((value) => {
          audioElem.volume = 1;
          console.log("Audio muted: ", audioElem.muted);
        })

        .catch((error) => logger.warn("audioElem.play() failed:%o", error));

      audioElem
        ?.setSinkId?.(sessionStorage.getItem(SESSION_STORAGE_KEY.SPEAKER_ID) || "default")
        .then(() => {})
        .catch((err) => console.log(err));

      this._runHark(stream);
    } else {
      audioElem.srcObject = null;
    }

    console.log("Set tracks: ", videoTrack);

    if (videoTrack) {
      const stream = new MediaStream();

      stream.addTrack(videoTrack);
      videoElem.srcObject = stream;

      videoElem.oncanplay = () => this.setState({ videoCanPlay: true });

      videoElem.onplay = () => {
        this.setState({ videoElemPaused: false });

        audioElem
          .play()
          .then((value) => {
            audioElem.volume = 1;
          })
          .catch((error) => {
            if (error.name === "NotAllowedError") {
              this.showBrowserPreventAutoplayModal();
            }

            logger.warn("audioElem.play() failed:%o", error);
          });
      };

      videoElem.onpause = () => this.setState({ videoElemPaused: true });

      videoElem
        .play()
        .then(() => {
          videoElem.volume = 1;
          videoElem.muted = true;
          logger.debug("Video element can play");
        })
        .catch((error: DOMException | Error) => {
          if (error.name === "NotAllowedError") {
            this.showBrowserPreventAutoplayModal();
          }
          logger.warn("videoElem.play() failed:%o", error);
        });

      this._startVideoResolution();

      // if (faceDetection) this._startFaceDetection();
    } else {
      videoElem.srcObject = null;
    }
  }

  _runHark(stream: MediaStream) {
    if (!stream.getAudioTracks()[0]) throw new Error("_runHark() | given stream has no audio track");

    this._hark = hark(stream, { play: false });

    // eslint-disable-next-line no-unused-vars
    this._hark.on("volume_change", (dBs, threshold) => {
      // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
      //   Math.pow(10, dBs / 20)
      // However it does not produce a visually useful output, so let exagerate
      // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
      // minimize component renderings.
      let audioVolume = Math.round(Math.pow(10, dBs / 85) * 10);

      if (audioVolume === 1) audioVolume = 0;

      if (audioVolume !== this.state.audioVolume) this.setState({ audioVolume });
    });
  }

  _startVideoResolution() {
    this._videoResolutionPeriodicTimer = setInterval(() => {
      const { videoResolutionWidth, videoResolutionHeight } = this.state;

      if (
        this.rfVideoElem.current?.videoWidth &&
        this.rfVideoElem.current?.videoHeight &&
        (this.rfVideoElem.current?.videoWidth !== videoResolutionWidth ||
          this.rfVideoElem.current?.videoHeight !== videoResolutionHeight)
      ) {
        this.setState({
          videoResolutionWidth: this.rfVideoElem.current.videoWidth,
          videoResolutionHeight: this.rfVideoElem.current.videoHeight,
        });
      }
    }, 500);
  }

  _stopVideoResolution() {
    clearInterval(this._videoResolutionPeriodicTimer);

    this.setState({
      videoResolutionWidth: null,
      videoResolutionHeight: null,
    });
  }

  // _startFaceDetection() {
  //   const { videoElem, canvas } = this.refs;

  //   const step = async () => {
  //     // NOTE: Somehow this is critical. Otherwise the Promise returned by
  //     // faceapi.detectSingleFace() never resolves or rejects.
  //     if (!this._videoTrack || videoElem.readyState < 2) {
  //       this._faceDetectionRequestAnimationFrame = requestAnimationFrame(step);

  //       return;
  //     }

  //     const detection = await faceapi.detectSingleFace(
  //       videoElem,
  //       tinyFaceDetectorOptions
  //     );

  //     if (detection) {
  //       const width = videoElem.offsetWidth;
  //       const height = videoElem.offsetHeight;

  //       canvas.width = width;
  //       canvas.height = height;

  //       // const resizedDetection = detection.forSize(width, height);
  //       const resizedDetections = faceapi.resizeResults(detection, {
  //         width,
  //         height,
  //       });

  //       faceapi.draw.drawDetections(canvas, resizedDetections);
  //     } else {
  //       // Trick to hide the canvas rectangle.
  //       canvas.width = 0;
  //       canvas.height = 0;
  //     }

  //     this._faceDetectionRequestAnimationFrame = requestAnimationFrame(() =>
  //       setTimeout(step, 100)
  //     );
  //   };

  //   step();
  // }

  // _stopFaceDetection() {
  //   cancelAnimationFrame(this._faceDetectionRequestAnimationFrame);

  //   const { canvas } = this.refs;

  //   canvas.width = 0;
  //   canvas.height = 0;
  // }
}

const mapStateToProps = (state: TAppState) => {
  const producers = state.producer;
  const consumers = state.consumer;
  const shareProducer =
    Object.values(producers).find((producer) => producer.type === "share") ||
    Object.values(consumers).find((consumer) => consumer.appData?.share);
  const isSharingScreen = !!shareProducer;
  return {
    isSharingScreen: isSharingScreen,
    peerPinId: state.room.peerPinId,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(PeerView));
