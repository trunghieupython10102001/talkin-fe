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
const Room_1 = require("./Room");
const helper_1 = require("./helper");
const livestream_room_enum_1 = require("../../../common/constants/livestream-room.enum");
class LivestreamRoom extends Room_1.default {
    constructor() {
        super(...arguments);
        this.status = livestream_room_enum_1.LivestreamRoomStatus.COMING_SOON;
    }
    async join(payload) {
        var _a, _b, _c, _d, _e, _f;
        const { peerId, data } = payload;
        const { device, rtpCapabilities, sctpCapabilities, isStreamer } = data;
        const peer = this.peers.get(peerId);
        if (!peer) {
            console.log('join livestream room ERROR: PEER NOT FOUND');
            return;
        }
        try {
            peer.isWaiting = false;
            peer.data = Object.assign(Object.assign({}, peer.data), { device,
                rtpCapabilities,
                sctpCapabilities });
            if (isStreamer)
                this.setupStreamer(peer);
            else
                this.handleNewPeer(peer);
            return {
                peers: this.peersCount,
                status: this.status,
                streamer: {
                    displayName: (_b = (_a = this.streamer) === null || _a === void 0 ? void 0 : _a.peerInfo) === null || _b === void 0 ? void 0 : _b.displayName,
                    avatarUrl: (_d = (_c = this.streamer) === null || _c === void 0 ? void 0 : _c.peerInfo) === null || _d === void 0 ? void 0 : _d.avatarUrl,
                    description: (_f = (_e = this.streamer) === null || _e === void 0 ? void 0 : _e.peerInfo) === null || _f === void 0 ? void 0 : _f.description,
                },
            };
        }
        catch (error) {
            console.log('join livestream room ERROR: ', error);
            peer.isWaiting = true;
            return;
        }
    }
    async stopLivestream(payload) {
        var _a;
        const { peerId } = payload;
        if (peerId !== ((_a = this.streamer) === null || _a === void 0 ? void 0 : _a.id))
            return 'Only streamer can stop stream.';
        this.status = livestream_room_enum_1.LivestreamRoomStatus.END;
        this.streamer = null;
        this.handleLeavePeer(peerId);
        await this.prismaService.livestreamRoom.update({
            where: { id: this.id },
            data: { status: livestream_room_enum_1.LivestreamRoomStatus.END.toString() },
        });
        this.broadcast('notification', {
            method: 'endstream',
            data: {},
        });
        return 'The livestream has ended!';
    }
    async createWebRtcTransport(payload) {
        var _a;
        const { peerId, data } = payload;
        const { producing } = data;
        const peer = this.getPeer(peerId);
        if (producing) {
            if (this.streamer || !((_a = peer === null || peer === void 0 ? void 0 : peer.peerInfo) === null || _a === void 0 ? void 0 : _a.isHost))
                return 'Only streamer can create stream.';
            if (this.status === livestream_room_enum_1.LivestreamRoomStatus.LIVE ||
                this.status === livestream_room_enum_1.LivestreamRoomStatus.END)
                return 'The stream has already activated or ended!';
        }
        return super.createWebRtcTransport(payload);
    }
    async produce(payload) {
        const producerData = await super.produce(payload);
        return producerData;
    }
    async setupStreamer(peer) {
        var _a;
        if (!peer.peerInfo.isHost ||
            ((_a = this.streamer) === null || _a === void 0 ? void 0 : _a.id) ||
            this.status !== livestream_room_enum_1.LivestreamRoomStatus.COMING_SOON)
            throw new common_1.UnauthorizedException();
        this.streamer = peer;
        this.streamer.io.join(this.id);
        this.status = livestream_room_enum_1.LivestreamRoomStatus.LIVE;
        await this.prismaService.livestreamRoom.update({
            where: { id: this.id },
            data: {
                status: livestream_room_enum_1.LivestreamRoomStatus.LIVE.toString(),
                realStartTime: new Date(),
            },
        });
        this.broadcastRoomState();
        this.streamer.io.on('disconnect', () => this.stopLivestream({ peerId: peer.id }));
    }
    broadcastRoomState() {
        const payload = {
            id: this.id,
            numberOfViewers: this.peersCount,
            status: this.status,
        };
        this.broadcast('notification', {
            method: 'roomStatusUpdated',
            data: payload,
        });
        this.wssServer
            .to(`RoomStatus_${this.id}`)
            .emit('roomStatusUpdated', payload);
    }
    handleNewPeer(peer) {
        super.handleNewPeer(peer);
        if (this.status == livestream_room_enum_1.LivestreamRoomStatus.END)
            throw new Error('Livestream Room has ended!');
        if (this.streamer) {
            for (const producer of Array.from(this.streamer.data.producers.values())) {
                this.createConsumer({
                    consumerPeer: peer,
                    producerPeer: this.streamer,
                    producer,
                });
            }
        }
        this.broadcastRoomState();
    }
    handleLeavePeer(peerId) {
        this.removePeer(peerId);
        this.broadcastRoomState();
    }
    get peersCount() {
        var _a;
        let joinPeerNumber = (_a = Array.from(this.peers.values()).filter((x) => !x.isWaiting)) === null || _a === void 0 ? void 0 : _a.length;
        if (!joinPeerNumber)
            return 0;
        if (this.streamer)
            joinPeerNumber--;
        return joinPeerNumber;
    }
    chat(payload) {
        var _a;
        const { peerId, data } = payload;
        const { content } = data;
        const sentAt = new Date();
        const peer = this.peers.get(peerId);
        if (!peer || !((_a = peer.peerInfo) === null || _a === void 0 ? void 0 : _a.userId))
            return { done: false, error: 'Login required!' };
        peer.io.to(this.id).emit('notification', {
            method: 'chat',
            data: {
                peerId,
                displayName: peer.peerInfo.displayName,
                avatarUrl: peer.peerInfo.avatarUrl,
                content,
                sentAt,
            },
        });
        return { done: true };
    }
}
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LivestreamRoom.prototype, "join", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LivestreamRoom.prototype, "stopLivestream", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LivestreamRoom.prototype, "createWebRtcTransport", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LivestreamRoom.prototype, "produce", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LivestreamRoom.prototype, "chat", null);
exports.default = LivestreamRoom;
//# sourceMappingURL=LivestreamRoom.js.map