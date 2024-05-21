"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAudioSdpText = exports.createVideoSdpText = void 0;
function createVideoSdpText(port) {
    return [
        'v=0',
        'o=- 0 0 IN IP4 127.0.0.1',
        's=FFmpeg',
        'c=IN IP4 127.0.0.1',
        't=0 0',
        `m=video ${port} RTP/AVP 101`,
        'a=rtpmap:101 VP8/90000',
        'a=sendonly',
    ].join('\n');
}
exports.createVideoSdpText = createVideoSdpText;
function createAudioSdpText(port) {
    return [
        'v=0',
        'o=- 0 0 IN IP4 127.0.0.1',
        's=FFmpeg',
        'c=IN IP4 127.0.0.1',
        't=0 0',
        `m=audio ${port} RTP/AVP 100`,
        'a=rtpmap:100 opus/48000/2',
        'a=sendonly',
    ].join('\n');
}
exports.createAudioSdpText = createAudioSdpText;
//# sourceMappingURL=sdp.js.map