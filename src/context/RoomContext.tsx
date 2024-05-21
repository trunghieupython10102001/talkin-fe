import React from 'react';
import RoomClient from '@/classes/RoomClient';
import type { types } from 'mediasoup-client';
import { useParams, useSearchParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

import { getUser } from '@/utils/cookiesManager';
import { getDeviceInfo } from '@/utils';
import { store } from '@/store';

RoomClient.init({ store });

const RoomContext = React.createContext<RoomClient | undefined>(undefined);

export const RoomContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [roomClient, setRoomClient] = React.useState<RoomClient | undefined>(undefined);
  const { roomId } = useParams();
  const isCreateRoomClient = React.useRef(false);

  React.useEffect(() => {
    const peerId = uuidV4();
    let displayName = searchParams.get('displayName') || (getUser() || {}).displayName;
    const handlerName = searchParams.get('handlerName') || searchParams.get('handler');
    const forceTcp = searchParams.get('forceTcp') === 'true';
    const produce = searchParams.get('produce') !== 'false';
    const consume = searchParams.get('consume') !== 'false';
    const datachannel = searchParams.get('datachannel') !== 'false';
    const forceVP8 = searchParams.get('forceVP8') === 'true';
    const forceH264 = searchParams.get('forceH264') === 'true';
    const forceVP9 = searchParams.get('forceVP9') === 'true';
    const enableWebcamLayers = searchParams.get('enableWebcamLayers') !== 'false';
    const enableSharingLayers = searchParams.get('enableSharingLayers') !== 'false';
    const webcamScalabilityMode = searchParams.get('webcamScalabilityMode');
    const sharingScalabilityMode = searchParams.get('sharingScalabilityMode');
    const numSimulcastStreams = searchParams.get('numSimulcastStreams')
      ? Number(searchParams.get('numSimulcastStreams'))
      : 3;
    // const info = searchParams.get('info') === 'true';
    // const faceDetection = searchParams.get('faceDetection') === 'true';
    const externalVideo = searchParams.get('externalVideo') === 'true';
    // const throttleSecret = searchParams.get('throttleSecret');
    const e2eKey = searchParams.get('e2eKey');
    const consumerReplicas = searchParams.get('consumerReplicas');
    const device = getDeviceInfo();

    for (const key of searchParams.keys()) {
      switch (key) {
        case 'roomId':
        case 'handlerName':
        case 'handler':
        case 'forceTcp':
        case 'produce':
        case 'consume':
        case 'datachannel':
        case 'forceVP8':
        case 'forceH264':
        case 'forceVP9':
        case 'enableWebcamLayers':
        case 'enableSharingLayers':
        case 'webcamScalabilityMode':
        case 'sharingScalabilityMode':
        case 'numSimulcastStreams':
        case 'info':
        case 'faceDetection':
        case 'externalVideo':
        case 'throttleSecret':
        case 'e2eKey':
        case 'consumerReplicas':
          break;

        default:
          searchParams.delete(key);
      }
    }

    if (!isCreateRoomClient.current) {
      const roomClient = new RoomClient({
        roomId: roomId as string,
        peerId,
        displayName,
        device,
        handlerName: handlerName as types.BuiltinHandlerName,
        forceTcp,
        produce,
        consume,
        datachannel,
        forceVP8,
        forceH264,
        forceVP9,
        enableWebcamLayers,
        enableSharingLayers,
        webcamScalabilityMode: webcamScalabilityMode as string,
        sharingScalabilityMode: sharingScalabilityMode as string,
        numSimulcastStreams,
        externalVideo,
        e2eKey: e2eKey as string,
        consumerReplicas: consumerReplicas as string,
      });
      setRoomClient(roomClient);
      setSearchParams(searchParams);
      isCreateRoomClient.current = true;
    }
  }, [roomId, searchParams, setSearchParams]);

  return <RoomContext.Provider value={roomClient}>{children}</RoomContext.Provider>;
};

export default RoomContext;
