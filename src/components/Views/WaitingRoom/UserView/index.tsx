import React from "react";
import hark from "hark";
import Logger from "@/classes/Logger";
import classnames from "classnames";
import { useStyles } from "./styles";
import { Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Stack } from "@mui/material";
import SoundWave from "@/components/common/SoundWave";
import { ReactComponent as VideoEyeIcon } from "@/assets/svg/video-eye.svg";
import { ReactComponent as CheckIcon } from "@/assets/svg/check.svg";
import { ReactComponent as FilledMicIcon } from "@/assets/svg/microphone-filled.svg";
import { ReactComponent as MicIcon } from "@/assets/svg/microphone.svg";
import { ReactComponent as SpeakerIcon } from "@/assets/svg/speaker.svg";
import { ReactComponent as CameraIcon } from "@/assets/svg/video.svg";
import { ReactComponent as VolumeUpIcon } from "@/assets/svg/volume-high.svg";
import { ReactComponent as CarretDownIcon } from "@/assets/svg/caret-down.svg";
import { MicrophoneOffIcon } from "@/assets";
import { SESSION_STORAGE_KEY } from "@/constants";

const logger = new Logger("PeerView");

interface IComponentProps {
  displayName: string;
  audioTrack?: MediaStreamTrack;
  videoTrack?: MediaStreamTrack;
  audioMuted?: boolean;
  videoVisible: boolean;
  classes: ReturnType<typeof useStyles>;
  microphones: MediaDeviceInfo[];
  webcams: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];

  // faceDetection: boolean;
  onChangeDisplayName: (data: string) => void;
  // onChangeMaxSendingSpatialLayer: func;
  // onChangeVideoPreferredLayers: func;
  // onChangeVideoPriority: func;
  // onRequestKeyFrame: func;
  // onStatsClick: func;
}

interface IComponentState {
  audioVolume: number;
  // showInfo: boolean;
  videoResolutionWidth: number | null;
  videoResolutionHeight: number | null;
  videoCanPlay: boolean;
  videoElemPaused: boolean;
  maxSpatialLayer: number | null;
  rfAnchorMic: HTMLButtonElement | null;
  rfAnchorSpeaker: HTMLButtonElement | null;
  rfAnchorCam: HTMLButtonElement | null;
  activeMic: MediaDeviceInfo | null;
  activeWebcam: MediaDeviceInfo | null;
  activeSpeaker: MediaDeviceInfo | null;
}

class UserView extends React.Component<IComponentProps, IComponentState> {
  _audioTrack?: MediaStreamTrack;
  _videoTrack?: MediaStreamTrack;
  _hark: hark.Harker | null;
  _videoResolutionPeriodicTimer: any;
  _faceDetectionRequestAnimationFrame: any;

  videoElem: React.RefObject<HTMLVideoElement>;
  audioElem: React.RefObject<HTMLAudioElement>;
  canvasElem: React.RefObject<HTMLCanvasElement>;

  constructor(props: IComponentProps) {
    super(props);

    this.state = {
      audioVolume: 0, // Integer from 0 to 10.,
      // showInfo: false,
      videoResolutionWidth: null,
      videoResolutionHeight: null,
      videoCanPlay: false,
      videoElemPaused: false,
      maxSpatialLayer: null,
      rfAnchorMic: null,
      rfAnchorSpeaker: null,
      rfAnchorCam: null,
      activeMic: null,
      activeWebcam: null,
      activeSpeaker: null,
    };

    this._audioTrack = undefined;
    this._videoTrack = undefined;
    this._hark = null;

    this._videoResolutionPeriodicTimer = null;

    this._faceDetectionRequestAnimationFrame = null;

    this.videoElem = React.createRef<HTMLVideoElement>();
    this.audioElem = React.createRef<HTMLVideoElement>();
    this.canvasElem = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    const { audioTrack, videoTrack } = this.props;

    this._setTracks(audioTrack, videoTrack);
  }

  componentDidUpdate(prevProps: Readonly<IComponentProps>, prevState: Readonly<IComponentState>, snapshot?: any): void {
    if (prevProps.audioTrack !== this.props.audioTrack) {
      this._setTrackAudio(this.props.audioTrack);
    }
    if (prevProps.videoTrack !== this.props.videoTrack) {
      this._setTrackVideo(this.props.videoTrack);
    }
    const { microphones, webcams, speakers } = this.props;
    if (
      microphones !== undefined &&
      microphones?.length > 0 &&
      prevProps.microphones !== microphones &&
      this.state.activeMic === null
    ) {
      const activeMic =
        microphones.find((mic) => mic.label === this._audioTrack?.label) ||
        microphones.find((mic) => mic.deviceId === "default") ||
        microphones[0];

      sessionStorage.setItem(SESSION_STORAGE_KEY.MIC_ID, activeMic.deviceId);
      this.setState({ activeMic: activeMic });
    }

    if (
      webcams !== undefined &&
      webcams?.length > 0 &&
      prevProps.webcams !== webcams &&
      this.state.activeWebcam === null
    ) {
      const activeWebcam =
        webcams.find((webcam) => webcam.label === this._videoTrack?.label) ||
        webcams.find((webcam) => webcam.deviceId === "default") ||
        webcams[0];

      sessionStorage.setItem(SESSION_STORAGE_KEY.CAMERA_ID, activeWebcam.deviceId);
      this.setState({ activeWebcam: activeWebcam });
    }

    if (
      speakers !== undefined &&
      speakers?.length > 0 &&
      prevProps.webcams !== speakers &&
      this.state.activeSpeaker === null
    ) {
      const activeSpeaker =
        speakers.find((speaker) => speaker.deviceId === (this.audioElem.current?.sinkId || "default")) || speakers[0];

      sessionStorage.setItem(SESSION_STORAGE_KEY.SPEAKER_ID, activeSpeaker.deviceId);
      this.setState({ activeSpeaker: activeSpeaker });
    }
  }

  componentWillUnmount(): void {
    console.log("Unmouint");

    this._stopVideoResolution();
    this._hark?.stop();
  }

  _setTracks(audioTrack?: MediaStreamTrack, videoTrack?: MediaStreamTrack) {
    if (this._audioTrack === audioTrack && this._videoTrack === videoTrack) return;

    this._audioTrack = audioTrack;
    this._videoTrack = videoTrack;

    if (this._hark) this._hark.stop();

    this._stopVideoResolution();

    const audioElem = this.audioElem.current;
    const videoElem = this.videoElem.current;

    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      audioElem!.srcObject = stream;

      audioElem!.play().catch((error) => logger.warn("audioElem.play() failed:%o", error));

      this._runHark(stream);
    } else {
      audioElem!.srcObject = null;
    }

    if (videoTrack) {
      const stream = new MediaStream();

      stream.addTrack(videoTrack);
      videoElem!.srcObject = stream;

      videoElem!.oncanplay = () => this.setState({ videoCanPlay: true });

      videoElem!.onplay = () => {
        this.setState({ videoElemPaused: false });

        audioElem!.play().catch((error) => logger.warn("audioElem.play() failed:%o", error));
      };

      videoElem!.onpause = () => this.setState({ videoElemPaused: true });

      videoElem!.play().catch((error) => logger.warn("videoElem.play() failed:%o", error));

      this._startVideoResolution();
      this._startSynchronizeWebCam();
    } else {
      videoElem!.srcObject = null;
    }
  }

  _setTrackAudio(audioTrack?: MediaStreamTrack) {
    if (this._audioTrack === audioTrack) return;

    this._audioTrack = audioTrack;

    if (this._hark) this._hark.stop();

    const audioElem = this.audioElem.current;
    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      audioElem!.srcObject = stream;

      audioElem!.play().catch((error) => logger.warn("audioElem.play() failed:%o", error));
      this._runHark(stream);
    } else {
      audioElem!.srcObject = null;
    }
  }

  _setTrackVideo(videoTrack?: MediaStreamTrack) {
    if (this._videoTrack === videoTrack) return;

    this._videoTrack = videoTrack;
    this._stopVideoResolution();

    const videoElem = this.videoElem.current;
    if (videoTrack) {
      const stream = new MediaStream();

      stream.addTrack(videoTrack);
      videoElem!.srcObject = stream;

      videoElem!.oncanplay = () => this.setState({ videoCanPlay: true });

      videoElem!.onplay = () => {
        this.setState({ videoElemPaused: false });
      };
      videoElem!.onpause = () => this.setState({ videoElemPaused: true });
      videoElem!.play().catch((error) => logger.warn("videoElem.play() failed:%o", error));

      this._startVideoResolution();
      this._startSynchronizeWebCam();
    } else {
      videoElem!.srcObject = null;
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

  _startSynchronizeWebCam() {
    if (!this.videoElem.current || !this.canvasElem.current) {
      return;
    }

    const videoElem: HTMLVideoElement = this.videoElem.current;
    const canvasElem: HTMLCanvasElement = this.canvasElem.current;
    const canvasContext = canvasElem.getContext("2d");

    const drawCaptured = () => {
      const { videoWidth: width, videoHeight: height } = videoElem;

      canvasElem.width = width;
      canvasElem.height = height;

      canvasContext!.drawImage(videoElem, 0, 0, width, height);

      this._faceDetectionRequestAnimationFrame = setTimeout(drawCaptured, 100);
    };

    drawCaptured();
  }

  _startVideoResolution() {
    this._videoResolutionPeriodicTimer = setInterval(() => {
      const { videoResolutionWidth, videoResolutionHeight } = this.state;

      if (
        this.videoElem.current?.videoWidth &&
        this.videoElem.current?.videoHeight &&
        (this.videoElem.current?.videoWidth !== videoResolutionWidth ||
          this.videoElem.current?.videoHeight !== videoResolutionHeight)
      ) {
        this.setState({
          videoResolutionWidth: this.videoElem.current.videoWidth,
          videoResolutionHeight: this.videoElem.current.videoHeight,
        });
      }
    }, 500);
  }

  _stopVideoResolution() {
    clearInterval(this._videoResolutionPeriodicTimer);
    clearTimeout(this._faceDetectionRequestAnimationFrame);

    this.setState({
      videoResolutionWidth: null,
      videoResolutionHeight: null,
    });
  }

  updateDisplayNameHandler(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    const value = event.target.value;

    this.props.onChangeDisplayName(value);
  }

  async handleTestSound() {
    const audio = document.createElement("audio") as HTMLAudioElement;
    await audio?.setSinkId?.(sessionStorage.getItem("speakerId") || "default");
    audio.controls = true;
    audio.autoplay = true;
    audio.src = "/media/audio-test.mp3";
  }

  switchMicHandler = async (micId: string) => {
    const { microphones } = this.props;
    const mediaTrack = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: micId } });
    const audioTrack = mediaTrack.getAudioTracks()[0];
    this._setTrackAudio(audioTrack);
    this.setState({ rfAnchorMic: null });
    sessionStorage.setItem(SESSION_STORAGE_KEY.MIC_ID, micId);
    this.setState({ activeMic: microphones?.find((mic) => mic.deviceId === micId) || null });
  };

  switchSpeakerHandler = async (speakerId: string) => {
    const { speakers } = this.props;
    await this.audioElem.current?.setSinkId?.(speakerId);
    this.setState({ rfAnchorSpeaker: null });
    sessionStorage.setItem(SESSION_STORAGE_KEY.SPEAKER_ID, speakerId);
    this.setState({ activeSpeaker: speakers?.find((speaker) => speaker.deviceId === speakerId) || null });
  };

  switchCameraHandler = async (cameraId: string) => {
    const { webcams } = this.props;
    const mediaTrack = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: cameraId, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
    const videoTrack = mediaTrack.getVideoTracks()[0];
    this._setTrackVideo(videoTrack);
    this.setState({ rfAnchorCam: null });
    sessionStorage.setItem(SESSION_STORAGE_KEY.CAMERA_ID, cameraId);
    this.setState({ activeWebcam: webcams?.find((webcam) => webcam.deviceId === cameraId) || null });
  };

  testCameraHandler = () => {};

  render() {
    const { videoVisible, classes, webcams, speakers, microphones, displayName, audioMuted } = this.props;
    const { audioVolume, rfAnchorMic, rfAnchorSpeaker, activeMic, activeSpeaker, activeWebcam } = this.state;

    return (
      <Box component="div" className={classes.wrapperVideo}>
        <div className={classes.displayName}>{displayName}</div>
        <video
          ref={this.videoElem}
          className={classnames(classes.videoStyles, {
            [classes.hidden]: videoVisible,
          })}
          autoPlay
          playsInline
          muted
          controls={false}
          style={{
            aspectRatio: `max(1.7777777777777777, ${
              (this.state.videoResolutionWidth || 0) / (this.state.videoResolutionHeight || 1)
            })`,
          }}
        />
        <audio ref={this.audioElem} autoPlay playsInline muted={true} controls={false} />
        <canvas
          ref={this.canvasElem}
          className={classnames(classes.videoStyles, {
            [classes.hidden]: !videoVisible,
          })}
          style={{
            aspectRatio: `max(1.7777777777777777, ${
              (this.state.videoResolutionWidth || 0) / (this.state.videoResolutionHeight || 1)
            })`,
          }}
        />
        <div className={classes.wrapperBoxSound}>
          {audioMuted ? <MicrophoneOffIcon /> : <SoundWave audioVolumn={audioVolume} />}
        </div>

        <Box component={Stack} direction="row" justifyContent="start" mt={1} spacing={1.25}>
          <Button
            className={classes.mediaControls}
            variant="text"
            title={activeMic?.label}
            onClick={(e) => {
              this.setState({ rfAnchorMic: e.currentTarget });
            }}
          >
            <MicIcon />
            <span className="text">{activeMic?.label || "-"}</span>
            <CarretDownIcon className={classnames({ down: !!this.state.rfAnchorMic })} />
          </Button>
          <Button
            className={classes.mediaControls}
            variant="text"
            title={activeSpeaker?.label}
            onClick={(e) => {
              this.setState({ rfAnchorSpeaker: e.currentTarget });
            }}
          >
            <SpeakerIcon />
            <span className="text">{activeSpeaker?.label || "-"}</span>
            <CarretDownIcon className={classnames({ down: !!this.state.rfAnchorSpeaker })} />
          </Button>
          <Button
            className={classes.mediaControls}
            variant="text"
            title={activeWebcam?.label}
            onClick={(e) => {
              this.setState({ rfAnchorCam: e.currentTarget });
            }}
          >
            <CameraIcon />
            <span className="text">{activeWebcam?.label || "-"}</span>
            <CarretDownIcon className={classnames({ down: !!this.state.rfAnchorCam })} />
          </Button>
        </Box>
        {/* Popover này để test mic
            Sau này có thể thêm ListItem option khác để thay đổi mic tương tự google meet 
        */}
        <Popover
          open={Boolean(rfAnchorMic)}
          anchorEl={rfAnchorMic}
          onClose={() => this.setState({ rfAnchorMic: null })}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box component="div" className={classnames(classes.boxMics, classes.box)}>
            <List>
              {microphones.map((mic) => (
                <ListItem
                  key={mic.deviceId}
                  className={classnames("item-list", {
                    active: mic.deviceId === activeMic?.deviceId,
                  })}
                >
                  <ListItemButton onClick={() => this.switchMicHandler(mic.deviceId)}>
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={mic.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <FilledMicIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Box component="div" className={classes.volumnContainer}>
                      <Box
                        component="div"
                        className="bar"
                        style={{
                          width: `${10 * audioVolume}%`,
                        }}
                      ></Box>
                    </Box>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Popover>

        {/* Popover này để test speaker
           Sau này có thể thêm ListItem option khác để thay đổi speaker tương tự google meet 
        */}
        <Popover
          open={Boolean(rfAnchorSpeaker)}
          anchorEl={rfAnchorSpeaker}
          onClose={() => this.setState({ rfAnchorSpeaker: null })}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box component="div" className={classnames(classes.boxSpeakers, classes.box)}>
            <List>
              {speakers.map((speaker) => (
                <ListItem
                  key={speaker.deviceId}
                  className={classnames("item-list", { active: speaker.deviceId === activeSpeaker?.deviceId })}
                >
                  <ListItemButton onClick={() => this.switchSpeakerHandler(speaker.deviceId)}>
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={speaker.label} />
                  </ListItemButton>
                </ListItem>
              ))}

              <ListItem>
                <ListItemButton onClick={this.handleTestSound}>
                  <ListItemIcon>
                    <VolumeUpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Test speakers" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Popover>

        <Popover
          open={!!this.state.rfAnchorCam}
          anchorEl={this.state.rfAnchorCam}
          onClose={() => this.setState({ rfAnchorCam: null })}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box component="div" className={classnames(classes.boxCameras, classes.box)}>
            <List>
              {webcams.map((camera) => (
                <ListItem
                  key={camera.deviceId}
                  className={classnames("item-list", { active: camera.deviceId === activeWebcam?.deviceId })}
                >
                  <ListItemButton onClick={() => this.switchCameraHandler(camera.deviceId)}>
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={camera.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem>
                <ListItemButton onClick={this.testCameraHandler}>
                  <ListItemIcon>
                    <VideoEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Make a test recording" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Popover>
      </Box>
    );
  }
}

function UserViewWrappper(props: Omit<IComponentProps, "classes">) {
  const classes = useStyles();

  return <UserView classes={classes} {...props} />;
}

export default UserViewWrappper;
