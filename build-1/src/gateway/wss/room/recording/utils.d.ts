/// <reference types="node" />
import { RtpParameters } from 'mediasoup/node/lib/RtpParameters';
import { Readable } from 'stream';
export declare function convertStringToStream(stringToConvert: string): Readable;
export declare function getCodecInfoFromRtpParameters(kind: string, rtpParameters: RtpParameters): {
    payloadType: number;
    codecName: string;
    clockRate: number;
    channels: number;
};
