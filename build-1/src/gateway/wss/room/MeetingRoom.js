"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const helper_1 = require("./helper");
const Room_1 = require("./Room");
const config = require("config");
const utils_1 = require("../../../common/utils/utils");
const meeting_record_enum_1 = require("../../../common/constants/meeting-record.enum");
const port_1 = require("./recording/port");
const FFmpeg_1 = require("./recording/FFmpeg");
const fs_1 = require("fs");
const recorder_composer_1 = require("../../../recorder-composer");
class MeetingRoom extends Room_1.default {
    handleNewPeer(peer) {
        super.handleNewPeer(peer);
        peer.io.to(this.id).emit('notification', {
            method: 'newPeer',
            data: {
                id: peer.id,
                displayName: peer.peerInfo.displayName || 'peer - ' + peer.id,
                device: peer.data.device,
                isGuest: peer.peerInfo.isGuest,
                isHost: peer.peerInfo.isHost,
                avatarUrl: peer.peerInfo.avatarUrl,
            },
        });
        const otherPeers = this.getJoinedPeers({ excludeId: peer.id });
        for (const otherPeer of otherPeers) {
            for (const producer of Array.from(otherPeer.data.producers.values())) {
                super.createConsumer({
                    consumerPeer: peer,
                    producerPeer: otherPeer,
                    producer,
                });
            }
        }
    }
    join(payload) {
        const { peerId, data } = payload;
        const { displayName, device, rtpCapabilities, sctpCapabilities } = data;
        const peer = this.peers.get(peerId);
        peer.isWaiting = false;
        peer.peerInfo.displayName = peer.peerInfo.displayName || displayName;
        peer.data = Object.assign(Object.assign({}, peer.data), { device,
            rtpCapabilities,
            sctpCapabilities, displayName: peer.peerInfo.displayName });
        this.handleNewPeer(peer);
        const peerInfos = this.getJoinedPeers({ excludeId: peer.id }).map((joinedPeer) => {
            return {
                id: joinedPeer.id,
                displayName: joinedPeer.peerInfo.displayName || 'peer - ' + joinedPeer.id,
                device: joinedPeer.data.device,
                isGuest: joinedPeer.peerInfo.isGuest,
                isHost: joinedPeer.peerInfo.isHost,
                avatarUrl: joinedPeer.peerInfo.avatarUrl,
            };
        });
        return {
            peers: peerInfos,
            isHost: peer.peerInfo.isHost,
            isRecording: !!this.recorder,
            presenter: this.presenter,
        };
    }
    async mutePeer(payload) {
        var _a;
        try {
            const { peerId, data } = payload;
            const { mutePeerId } = data;
            const hostPeer = this.peers.get(peerId);
            if (!((_a = hostPeer === null || hostPeer === void 0 ? void 0 : hostPeer.peerInfo) === null || _a === void 0 ? void 0 : _a.isHost)) {
                throw new common_1.UnauthorizedException();
            }
            const mutePeer = this.peers.get(mutePeerId);
            if (!mutePeer) {
                throw new Error('Peer not found!');
            }
            const muteProducers = Array.from(mutePeer.data.producers.values()).filter((x) => x.kind == 'audio');
            if (muteProducers.length) {
                for (let i = 0; i < muteProducers.length; i++) {
                    await this.pauseProducer({
                        peerId: mutePeerId,
                        data: {
                            producerId: muteProducers[i].id,
                        },
                    });
                }
                this.notifyPeer(mutePeer.io, 'muted', {
                    peerId: mutePeerId,
                });
            }
            return true;
        }
        catch (error) {
            console.log('mutePeer ERROR: ', error);
            return false;
        }
    }
    async removePeerByHost(payload) {
        var _a;
        try {
            const { peerId, data } = payload;
            const { removePeerId } = data;
            const hostPeer = this.peers.get(peerId);
            if (!((_a = hostPeer === null || hostPeer === void 0 ? void 0 : hostPeer.peerInfo) === null || _a === void 0 ? void 0 : _a.isHost)) {
                throw new common_1.UnauthorizedException();
            }
            console.log('removePeerId: ', removePeerId);
            const removePeer = this.peers.get(removePeerId);
            if (!removePeer) {
                throw new Error('Peer not found!');
            }
            this.notifyPeer(removePeer.io, 'kicked', {
                peerId: removePeerId,
            });
            this.removePeer(removePeerId);
            removePeer.io.disconnect();
            this.broadcast('notification', {
                method: 'removedPeer',
                data: {
                    peerId: removePeerId,
                    displayName: removePeer.peerInfo.displayName || 'peer - ' + removePeer.id,
                },
            });
            return true;
        }
        catch (error) {
            console.log('removePeer ERROR: ', error);
            return false;
        }
    }
    async produce(payload) {
        const { peerId, data } = payload;
        const { kind, appData } = data;
        const peer = this.getPeer(peerId);
        if (this.presenter && (appData === null || appData === void 0 ? void 0 : appData.share)) {
            throw new Error('Can not share while other is sharing screen');
        }
        const res = await super.produce(payload);
        const producer = peer.data.producers.get(res.id);
        if (this.recorder) {
            if (appData === null || appData === void 0 ? void 0 : appData.share) {
                if (this.recorder.screenConsumer)
                    this.recorder.screenConsumer.close();
                await this.publishProducerRtpStream(producer, 'video', true);
            }
            else if (this.recorder.peerId === peerId && kind === 'video') {
                if (this.recorder.videoConsumer)
                    this.recorder.videoConsumer.close();
                await this.publishProducerRtpStream(producer, 'video');
            }
        }
        return res;
    }
    async requestRecord(payload) {
        var _a;
        try {
            const { peerId } = payload;
            console.log('requestRecord PeerId: ', peerId);
            const requestPeer = this.peers.get(peerId);
            if (!((_a = requestPeer === null || requestPeer === void 0 ? void 0 : requestPeer.peerInfo) === null || _a === void 0 ? void 0 : _a.userId)) {
                throw new common_1.UnauthorizedException();
            }
            if (this.recorder && this.peers.get(this.recorder.peerId)) {
                throw new Error(`Can not requestRecord when ${this.recorder.peerId} is recording!`);
            }
            this.handleStartRecord(peerId);
            requestPeer.io.to(this.id).emit('notification', {
                method: 'startRecord',
                data: {
                    id: requestPeer.id,
                    displayName: requestPeer.peerInfo.displayName || 'peer - ' + requestPeer.id,
                    device: requestPeer.data.device,
                    isGuest: requestPeer.peerInfo.isGuest,
                    isHost: requestPeer.peerInfo.isHost,
                    avatarUrl: requestPeer.peerInfo.avatarUrl,
                },
            });
            return true;
        }
        catch (error) {
            console.log('requestRecord ERROR: ', error);
            return false;
        }
    }
    async stopRecord(payload) {
        var _a;
        try {
            const { peerId } = payload;
            console.log('requestStopPeer PeerId: ', peerId);
            const requestStopPeer = this.peers.get(peerId);
            if (!((_a = requestStopPeer === null || requestStopPeer === void 0 ? void 0 : requestStopPeer.peerInfo) === null || _a === void 0 ? void 0 : _a.userId)) {
                throw new common_1.UnauthorizedException();
            }
            if (!this.recorder) {
                throw new common_1.UnauthorizedException();
            }
            this.handleStopRecordComposeAndSendMail();
            this.broadcast('notification', {
                method: 'stopRecording',
                data: {
                    id: requestStopPeer.id,
                    displayName: requestStopPeer.peerInfo.displayName ||
                        'peer - ' + requestStopPeer.id,
                    device: requestStopPeer.data.device,
                    isGuest: requestStopPeer.peerInfo.isGuest,
                    isHost: requestStopPeer.peerInfo.isHost,
                    avatarUrl: requestStopPeer.peerInfo.avatarUrl,
                },
            });
            return true;
        }
        catch (error) {
            console.log('stopRecord ERROR: ', error);
            return false;
        }
    }
    handleStopRecord() {
        for (const process of this.recorder.processes.values()) {
            process.kill();
        }
        for (const transport of this.recorder.transports.values()) {
            transport.close();
        }
        for (const remotePort of this.recorder.remotePorts) {
            (0, port_1.releasePort)(remotePort);
        }
        const outputScriptPath = `${config.recorder.outputDir}/${this.id}/script.json`;
        (0, fs_1.writeFileSync)(outputScriptPath, JSON.stringify(this.recorder.script, null, 2), 'utf-8');
        this.recorder = null;
        return outputScriptPath;
    }
    removePeer(peerId) {
        var _a;
        super.removePeer(peerId);
        if (((_a = this.recorder) === null || _a === void 0 ? void 0 : _a.peerId) == peerId) {
            this.handleStopRecordComposeAndSendMail();
            this.broadcast('notification', {
                method: 'stopRecording',
                data: {
                    id: peerId,
                },
            });
        }
    }
    close() {
        super.close();
        if (this.recorder) {
            this.handleStopRecordComposeAndSendMail();
        }
    }
    handleStopRecordComposeAndSendMail() {
        var _a, _b;
        const recorderUserId = (_b = (_a = this.recorder.script) === null || _a === void 0 ? void 0 : _a.recorder) === null || _b === void 0 ? void 0 : _b.userId;
        const outputScript = this.handleStopRecord();
        setTimeout(() => {
            (0, recorder_composer_1.compose)(outputScript).then(() => {
                void this.sendMailRecordFinish(recorderUserId);
                console.log(`Compose record finished -  room ${this.id}!`);
            });
        }, 10000);
        void this.sendMailRecord(meeting_record_enum_1.MeetingRecordType.PROCESSING, recorderUserId);
        console.log(`Recording stop - room ${this.id}!`);
    }
    async sendMailRecordFinish(recorderUserId) {
        const recordLink = process.env.API_DOMAIN + 'records/' + this.id + '.mp4';
        await this.sendMailRecord(meeting_record_enum_1.MeetingRecordType.FINISHED, recorderUserId, recordLink);
    }
    async sendMailRecord(type, recorderUserId, recordLink) {
        try {
            const meetingRoom = await this.prismaService.room.findFirst({
                where: { id: this.id },
            });
            if (!meetingRoom)
                return;
            const userHost = await this.prismaService.user.findFirst({
                where: { id: meetingRoom.creatorId },
            });
            let toEmails = userHost.email;
            if (recorderUserId) {
                const userRecord = await this.prismaService.user.findFirst({
                    where: { id: Number(recorderUserId) },
                });
                if (userRecord === null || userRecord === void 0 ? void 0 : userRecord.email)
                    toEmails += ',' + userRecord.email;
            }
            if (toEmails) {
                const date = (0, utils_1.getFormattedDate)(meetingRoom.startTime);
                const meetingRecordEmailContext = {
                    to: toEmails,
                    meetingName: meetingRoom.name,
                    date,
                    recordLink,
                };
                if (type === 'processing') {
                    await this.mailService.sendEmailMeetingRecordProcessing(meetingRecordEmailContext);
                }
                else if (type === 'finished') {
                    await this.mailService.sendEmailMeetingRecordFinish(meetingRecordEmailContext);
                }
            }
        }
        catch (error) {
            console.log(`sendMailRecord ${this.id} room ERROR: `, error);
        }
    }
    async handleStartRecord(peerId) {
        const peer = this.getPeer(peerId);
        this.recorder = {
            peerId,
            transports: new Map(),
            remotePorts: [],
            processes: new Map(),
            script: {
                meeting_id: this.id,
                start_time: Date.now().toString(),
                recorder: {
                    name: peer.data.displayName,
                    userId: peer.peerInfo.userId,
                },
                videos: [],
                audios: [],
                screens: [],
            },
        };
        const videoProducer = Array.from(peer.data.producers.values()).find((producer) => producer.kind === 'video');
        const audioProducer = Array.from(peer.data.producers.values()).find((producer) => producer.kind === 'audio');
        if (videoProducer) {
            await this.publishProducerRtpStream(videoProducer, 'video');
        }
        if (this.presenter) {
            const presenterPeer = this.peers.get(this.presenter.peerId);
            if (presenterPeer) {
                const presenterProducer = presenterPeer.data.producers.get(this.presenter.producerId);
                if (presenterProducer)
                    await this.publishProducerRtpStream(presenterProducer, 'video', true);
            }
        }
        if (audioProducer) {
            await this.publishProducerRtpStream(audioProducer, 'audio');
        }
    }
    async createLocalTransport(rtpPort, rtcpPort) {
        const transport = await this.router.createPlainTransport(Object.assign({ rtcpMux: false }, config.recorder.transport));
        await transport.connect({
            ip: config.recorder.target.ip,
            port: rtpPort,
            rtcpPort: rtcpPort,
        });
        return transport;
    }
    async publishProducerRtpStream(producer, type, isScreen = false) {
        const port = await (0, port_1.getPort)();
        const rtcpPort = await (0, port_1.getPort)();
        this.recorder.remotePorts.push(port, rtcpPort);
        const transport = await this.createLocalTransport(port, rtcpPort);
        const codecs = [];
        const routerCodec = this.router.rtpCapabilities.codecs.find((codec) => codec.kind === type);
        codecs.push(routerCodec);
        const rtpCapabilities = {
            codecs,
            rtcpFeedback: [],
        };
        const consumer = await transport.consume({
            producerId: producer.id,
            rtpCapabilities,
            paused: true,
        });
        let outputFile;
        const ffmpegProcess = new FFmpeg_1.FFmpeg(this.id);
        if (type === 'video') {
            outputFile = ffmpegProcess._createVideoRecorder(port);
            if (isScreen) {
                this.recorder.script.screens.push(outputFile);
                this.recorder.screenConsumer = consumer;
            }
            else {
                this.recorder.script.videos.push(outputFile);
                this.recorder.videoConsumer = consumer;
            }
        }
        else {
            outputFile = ffmpegProcess._createAudioRecorder(port);
            this.recorder.script.audios.push(outputFile);
            this.recorder.audioConsumer = consumer;
        }
        const processKey = isScreen ? 'screen' : type;
        this.recorder.processes.set(processKey, ffmpegProcess);
        this.recorder.transports.set(transport.id, transport);
        setTimeout(async () => {
            if (consumer) {
                await consumer.resume();
                await consumer.requestKeyFrame();
            }
        }, 1000);
        consumer.on('producerclose', () => {
            console.log('---- producerclose -----');
            console.log(producer.id, transport.id, processKey);
            console.log('---- producerclose -----');
            this.recorder.processes.get(processKey).kill();
            this.recorder.transports.get(transport.id).close();
            consumer.close();
        });
        return {
            consumerId: consumer.id,
            remoteRtpPort: port,
            remoteRtcpPort: rtcpPort,
            localRtcpPort: transport.rtcpTuple
                ? transport.rtcpTuple.localPort
                : undefined,
            rtpCapabilities,
            rtpParameters: consumer.rtpParameters,
        };
    }
}
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MeetingRoom.prototype, "join", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeetingRoom.prototype, "mutePeer", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeetingRoom.prototype, "removePeerByHost", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeetingRoom.prototype, "produce", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeetingRoom.prototype, "requestRecord", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeetingRoom.prototype, "stopRecord", null);
exports.default = MeetingRoom;
//# sourceMappingURL=MeetingRoom.js.map