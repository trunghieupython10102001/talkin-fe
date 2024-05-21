"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodecInfoFromRtpParameters = exports.convertStringToStream = void 0;
const stream_1 = require("stream");
function convertStringToStream(stringToConvert) {
    const stream = new stream_1.Readable();
    stream.push(stringToConvert);
    stream.push(null);
    return stream;
}
exports.convertStringToStream = convertStringToStream;
function getCodecInfoFromRtpParameters(kind, rtpParameters) {
    return {
        payloadType: rtpParameters.codecs[0].payloadType,
        codecName: rtpParameters.codecs[0].mimeType.replace(`${kind}/`, ''),
        clockRate: rtpParameters.codecs[0].clockRate,
        channels: kind === 'audio' ? rtpParameters.codecs[0].channels : undefined,
    };
}
exports.getCodecInfoFromRtpParameters = getCodecInfoFromRtpParameters;
//# sourceMappingURL=utils.js.map