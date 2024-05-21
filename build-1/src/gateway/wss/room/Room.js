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
const config = require("config");
const lib_1 = require("../../../common/lib");
const helper_1 = require("./helper");
const mediasoupSettings = config.get('mediasoup');
class Room {
    constructor(worker, workerIndex, id, wssServer, prismaService, mailService) {
        this.worker = worker;
        this.workerIndex = workerIndex;
        this.id = id;
        this.wssServer = wssServer;
        this.prismaService = prismaService;
        this.mailService = mailService;
        this.peers = new Map();
        this.presenter = null;
    }
    async initRouter() {
        this.router = await this.worker.createRouter({
            mediaCodecs: (0, lib_1.cloneObject)(mediasoupSettings.router.mediaCodecs),
        });
        this.audioLevelObserver = await this.router.createAudioLevelObserver({
            maxEntries: 1,
            threshold: -80,
            interval: 800,
        });
        this.audioLevelObserver.on('volumes', (volumes) => {
        });
        this.audioLevelObserver.on('silence', () => {
        });
    }
    getRouterRtpCapabilities() {
        return this.router.rtpCapabilities;
    }
    async createWebRtcTransport(payload) {
        const { peerId, data } = payload;
        const { consuming, producing } = data;
        const peer = this.peers.get(peerId);
        const { initialAvailableOutgoingBitrate } = mediasoupSettings.webRtcTransport;
        const transport = await this.router.createWebRtcTransport({
            listenIps: mediasoupSettings.webRtcTransport.listenIps,
            enableUdp: true,
            enableSctp: true,
            enableTcp: true,
            initialAvailableOutgoingBitrate,
            appData: { peerId, consuming, producing },
        });
        peer.data.transports.set(transport.id, transport);
        return {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            sctpParameters: transport.sctpParameters,
        };
    }
    async connectWebRtcTransport(payload) {
        const { data, peerId } = payload;
        const { transportId, dtlsParameters } = data;
        const peer = this.peers.get(peerId);
        const transport = peer.data.transports.get(transportId);
        if (!transport)
            throw new Error(`transport with id "${transportId}" not found`);
        if (transport.dtlsState === 'connected' ||
            transport.dtlsState === 'connecting') {
            console.log('Transport is already connected or connecting!');
        }
        else {
            console.log('Transport is new.');
            await transport.connect({ dtlsParameters });
        }
        return { msg: 'transport connected', ok: true };
    }
    async produce(payload) {
        const { peerId, data } = payload;
        const { transportId, kind, rtpParameters, appData } = data;
        const peer = this.peers.get(peerId);
        const transport = peer.data.transports.get(transportId);
        const producer = await transport.produce({
            kind,
            rtpParameters,
            appData: {
                peerId,
                kind,
                displayName: peer.peerInfo.displayName,
                share: appData === null || appData === void 0 ? void 0 : appData.share,
            },
        });
        peer.data.producers.set(producer.id, producer);
        if (producer.kind === 'audio') {
            await this.audioLevelObserver.addProducer({
                producerId: producer.id,
            });
        }
        if (appData === null || appData === void 0 ? void 0 : appData.share) {
            this.presenter = { peerId, producerId: producer.id };
        }
        const otherPeers = this.getJoinedPeers({ excludeId: peer.id });
        for (const otherPeer of otherPeers) {
            this.createConsumer({
                consumerPeer: otherPeer,
                producerPeer: peer,
                producer,
            });
        }
        return { id: producer.id };
    }
    async createConsumer(args) {
        const { consumerPeer, producerPeer, producer } = args;
        console.log('create consumer', consumerPeer.id);
        const transport = Array.from(consumerPeer.data.transports.values()).find((t) => {
            return t.appData.consuming;
        });
        if (!transport) {
            console.warn('createConsumer() | Transport for consuming not found');
            return;
        }
        let consumer;
        try {
            consumer = await transport.consume({
                producerId: producer.id,
                rtpCapabilities: consumerPeer.data.rtpCapabilities,
                enableRtx: true,
                paused: true,
            });
            consumerPeer.io.emit('newConsumer', {
                peerId: producerPeer.id,
                producerId: producer.id,
                id: consumer.id,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                type: consumer.type,
                appData: producer.appData,
                producerPaused: consumer.producerPaused,
            });
            await consumer.resume();
        }
        catch (error) {
            console.warn('createConsumer() | transport.consume():%o', error);
            return;
        }
        consumerPeer.data.consumers.set(consumer.id, consumer);
        consumer.on('transportclose', () => {
            consumerPeer.data.consumers.delete(consumer.id);
        });
        consumer.on('producerclose', () => {
            consumerPeer.data.consumers.delete(consumer.id);
            this.notifyPeer(consumerPeer.io, 'consumerClosed', {
                consumerId: consumer.id,
                appData: producer.appData,
            });
        });
        consumer.on('producerpause', () => {
            this.notifyPeer(consumerPeer.io, 'consumerPaused', {
                consumerId: consumer.id,
            });
        });
        consumer.on('producerresume', () => {
            this.notifyPeer(consumerPeer.io, 'consumerResumed', {
                consumerId: consumer.id,
            });
        });
    }
    async restartIce(payload) {
        const { data, peerId } = payload;
        const { transportId } = data;
        const peer = this.peers.get(peerId);
        const transport = peer.data.transports.get(transportId);
        if (!transport)
            throw new Error(`transport with id "${transportId}" not found`);
        const iceParameters = await transport.restartIce();
        return iceParameters;
    }
    async pauseProducer(payload) {
        const { peerId, data } = payload;
        const { producerId } = data;
        const peer = this.peers.get(peerId);
        const producer = peer.data.producers.get(producerId);
        if (!producer)
            throw new Error(`producer with id "${producerId}" not found`);
        await producer.pause();
        return { done: true };
    }
    async closeProducer(payload) {
        var _a;
        const { peerId, data } = payload;
        const { producerId } = data;
        const peer = this.peers.get(peerId);
        const producer = peer.data.producers.get(producerId);
        if (!producer)
            throw new Error(`producer with id "${producerId}" not found`);
        if ((_a = producer.appData) === null || _a === void 0 ? void 0 : _a.share) {
            this.presenter = null;
        }
        producer.close();
        peer.data.producers.delete(producerId);
        return { done: true };
    }
    async resumeProducer(payload) {
        const { peerId, data } = payload;
        const { producerId } = data;
        const peer = this.peers.get(peerId);
        const producer = peer.data.producers.get(producerId);
        if (!producer)
            throw new Error(`producer with id "${producerId}" not found`);
        await producer.resume();
        return { done: true };
    }
    chat(payload) {
        const { peerId, data } = payload;
        const { content } = data;
        const sentAt = new Date();
        const peer = this.peers.get(peerId);
        if (!peer || peer.isWaiting)
            return;
        peer.io.to(this.id).emit('notification', {
            method: 'chat',
            data: {
                peerId,
                content,
                sentAt,
            },
        });
        return { done: true };
    }
    handleNewPeer(peer) {
        peer.isWaiting = false;
        peer.io.join(this.id);
        peer.io.on('disconnect', () => this.handleLeavePeer(peer.id));
    }
    addPeer(peerId, socket, peerInfo) {
        this.peers.set(peerId, {
            id: peerId,
            io: socket,
            isWaiting: true,
            data: {
                transports: new Map(),
                producers: new Map(),
                consumers: new Map(),
                device: 'userDevice',
            },
            peerInfo,
        });
    }
    getPeer(peerId) {
        return this.peers.get(peerId);
    }
    getAllPeers() {
        return this.peers;
    }
    handleLeavePeer(peerId) {
        this.removePeer(peerId);
        this.broadcast('notification', {
            method: 'peerClosed',
            data: {
                peerId: peerId,
            },
        });
    }
    removePeer(peerId) {
        var _a;
        const peer = this.peers.get(peerId);
        if (!peer)
            return;
        for (const producer of peer.data.producers.values()) {
            if ((_a = producer.appData) === null || _a === void 0 ? void 0 : _a.share) {
                this.presenter = null;
            }
            producer.close();
        }
        for (const transport of peer.data.transports.values()) {
            transport.close();
        }
        this.peers.delete(peerId);
    }
    getPeers({ excludeId }) {
        const peers = Array.from(this.peers.values()).filter((joinedPeer) => joinedPeer.id !== excludeId);
        return peers;
    }
    get peersCount() {
        return this.peers.size;
    }
    close() {
        this.audioLevelObserver.close();
        this.router.close();
    }
    getJoinedPeers({ excludeId }) {
        const peers = Array.from(this.peers.values()).filter((joinedPeer) => joinedPeer.id !== excludeId && !joinedPeer.isWaiting);
        return peers;
    }
    notifyPeer(peer, eventName, payload) {
        peer.emit('notification', {
            method: eventName,
            data: payload,
        });
    }
    broadcast(eventName, payload) {
        this.wssServer.to(this.id).emit(eventName, payload);
    }
    async handleEvent(eventName, payload) {
        const foundHandler = this[eventName];
        if (!foundHandler || !foundHandler.isRpcMethod) {
            return Promise.resolve(`Err! Not found ${eventName} handler`);
        }
        try {
            const data = await foundHandler.apply(this, [payload]);
            return data;
        }
        catch (_a) {
            return Promise.resolve(`Err! ${eventName} handler ERROR`);
        }
    }
}
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Room.prototype, "getRouterRtpCapabilities", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Room.prototype, "createWebRtcTransport", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Room.prototype, "connectWebRtcTransport", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Room.prototype, "produce", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Room.prototype, "restartIce", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Room.prototype, "pauseProducer", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Room.prototype, "closeProducer", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Room.prototype, "resumeProducer", null);
__decorate([
    helper_1.rpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Room.prototype, "chat", null);
exports.default = Room;
//# sourceMappingURL=Room.js.map