import React, { useLayoutEffect, useRef, useEffect } from "react";
import { useRoom } from "./use-room";
import Me from "@/components/Views/VideoCall/Me";
import Peer from "@/components/Views/VideoCall/Peer";
import { Avatar, AvatarGroup, Typography } from "@mui/material";
import { useStyles } from "./styles";

interface IPeers {
  drawerOpen: boolean;
}

const Peers: React.FC<IPeers> = ({ drawerOpen = false }) => {
  const classes = useStyles();
  const { peers, isSharingScreen, shareProducer, handlePin, peerPinId, me } = useRoom();
  const dish = useRef<HTMLDivElement>(null);
  const peerPin = useRef<HTMLDivElement>(null);
  const width = useRef<number>(0);
  const height = useRef<number>(0);
  const rfVideoShare = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    function updateSize() {
      if (dish.current) {
        width.current = dish.current?.offsetWidth - 10 * 2;
        height.current = dish.current?.offsetHeight - 10 * 2;
      }
      let max = 0;
      let i = 1;
      while (i < 5000) {
        let area = areaFn(i);
        if (area === false) {
          max = i - 1;
          break;
        }
        i++;
      }

      max = max - 10 * 2;
      resizer(max);
    }

    function areaFn(increment: number) {
      let i = 0;
      let w = 0;
      let h = increment * 0.5625 + 10 * 2;
      if (dish.current) {
        while (i < dish.current?.children.length) {
          if (w + increment > width.current) {
            w = 0;
            h = h + increment * 0.5625 + 10 * 2;
          }
          w = w + increment + 10 * 2;
          i++;
        }
        if (h > height.current || increment > width.current) return false;
        else return increment;
      }
      return increment;
    }

    function resizer(width: number) {
      if (dish.current) {
        for (let s = 0; s < dish.current.children.length; s++) {
          // camera fron dish (div without class)
          const element = dish.current.children[s] as HTMLDivElement;

          if (element) {
            // custom margin
            element.style.margin = 10 + "px";

            // calculate dimensions
            element.style.width = width + "px";
            element.style.height = width * 0.5625 + "px";
          }
        }
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [peers.length, drawerOpen, peerPinId, isSharingScreen]);

  useEffect(() => {
    if (isSharingScreen) {
      const videoElement = rfVideoShare.current as HTMLVideoElement;
      if (shareProducer?.track) {
        const stream = new MediaStream();
        stream.addTrack(shareProducer?.track);
        videoElement.srcObject = stream;
        videoElement
          .play()
          .then(() => {
            videoElement.muted = true;
          })
          .catch((error: DOMException | Error) => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSharingScreen]);

  return (
    <>
      {peerPinId && peerPinId !== me.id && (
        <div className={classes.peerPin} ref={peerPin}>
          <Peer key={peerPinId} handlePin={handlePin} id={peerPinId} />
        </div>
      )}
      {peerPinId && peerPinId === me.id && (
        <div className={classes.peerPin} ref={peerPin}>
          <Me key={peerPinId} handlePin={handlePin} />
        </div>
      )}
      {isSharingScreen && (
        <div className={classes.shareScreen} ref={peerPin}>
          <video
            className={classes.videoElement}
            ref={rfVideoShare}
            autoPlay
            playsInline
            muted={true}
            controls={false}
          />
        </div>
      )}
      <div
        ref={dish}
        className={classes.listPeer}
        style={{
          width: drawerOpen ? "calc(100% / 12 * 9)" : "20%",
        }}
      >
        {peerPinId !== me.id && (
          <div>
            <Me key={me.id} handlePin={handlePin} />
          </div>
        )}
        {peers.length > 5 ? (
          <>
            {peers.slice(0, 4).map((peer) => (
              <div>
                <Peer handlePin={handlePin} id={peer.id} key={peer.id} />
              </div>
            ))}
            <div className={classes.peerOther}>
              <AvatarGroup total={peers.slice(4).length}>
                {peers.slice(4, 5).map((item) => (
                  <Avatar
                    sx={{ width: peerPinId === "" ? 90 : 65, height: peerPinId === "" ? 90 : 65 }}
                    src={`${process.env.REACT_APP_BE_BASE_URL}/${item.avatarUrl}`}
                    alt={item.displayName}
                  />
                ))}
              </AvatarGroup>
              <Typography component="p" className="title">
                {peers.slice(4).length} others
              </Typography>
            </div>
          </>
        ) : (
          <>
            {peers.map((peer) => (
              <div>
                <Peer handlePin={handlePin} id={peer.id} key={peer.id} />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Peers;
