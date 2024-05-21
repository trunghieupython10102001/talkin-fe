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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WssGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const mediasoup = require("mediasoup");
const config = require("config");
const io = require("socket.io");
const lib_1 = require("../../common/lib");
const wss_guard_1 = require("./wss.guard");
const RoomFactory_1 = require("./room/RoomFactory");
const prisma_service_1 = require("../../share/prisma/prisma.service");
const livestream_room_enum_1 = require("../../common/constants/livestream-room.enum");
const mail_service_1 = require("../../share/mailer/mail.service");
const mediasoupSettings = config.get('mediasoup');
let WssGateway = class WssGateway {
    constructor(wssGuard, prismaService, mailService) {
        this.wssGuard = wssGuard;
        this.prismaService = prismaService;
        this.mailService = mailService;
        this.rooms = new Map();
        this.createWorkers();
        this.roomFactory = new RoomFactory_1.default();
    }
    async createWorker(index) {
        const worker = await mediasoup.createWorker(mediasoupSettings.worker);
        if (process.env.MEDIASOUP_USE_WEBRTC_SERVER !== 'false') {
            const webRtcServerOptions = (0, lib_1.cloneObject)(mediasoupSettings.webRtcServer);
            const portIncrement = index;
            for (const listenInfo of webRtcServerOptions.listenInfos) {
                listenInfo.port += portIncrement;
            }
            const webRtcServer = await worker.createWebRtcServer(webRtcServerOptions);
            worker.appData.webRtcServer = webRtcServer;
        }
        worker.on('died', () => {
            console.error('mediasoup Worker died, exiting  in 2 seconds... [pid:%d]', worker.pid);
            setTimeout(() => process.exit(1), 2000);
        });
        setInterval(async () => {
            const usage = await worker.getResourceUsage();
            console.info('mediasoup Worker resource usage [pid:%d]: %o', worker.pid, usage);
        }, 120000);
        return worker;
    }
    async createWorkers() {
        const createWorkerPromises = [];
        for (let i = 0; i < mediasoupSettings.workerPool; i++) {
            createWorkerPromises.push(this.createWorker(i));
        }
        this.workers = (await Promise.all(createWorkerPromises)).reduce((acc, worker, index) => {
            acc[index] = {
                clientsCount: 0,
                roomsCount: 0,
                pid: worker.pid,
                worker,
            };
            return acc;
        }, {});
    }
    getOptimalWorkerIndex() {
        return parseInt(Object.entries(this.workers).reduce((prev, curr) => {
            if (prev[1].clientsCount < curr[1].clientsCount) {
                return prev;
            }
            return curr;
        })[0], 10);
    }
    async getClientQuery(client) {
        try {
            const clientQuery = client.handshake.query;
            const clientInfo = await this.wssGuard.verifyClientQuery(clientQuery);
            return clientInfo;
        }
        catch (error) {
            console.log('getClientQuery ERROR: ', error);
            return;
        }
    }
    async getOrCreateRoom(roomId, isLivestreamRoom) {
        let room = this.rooms.get(roomId);
        if (!room) {
            const index = this.getOptimalWorkerIndex();
            const roomParams = {
                worker: this.workers[index].worker,
                workerIndex: index,
                id: roomId,
                wssServer: this.server,
                mailService: this.mailService,
                prismaService: this.prismaService,
            };
            room = isLivestreamRoom
                ? this.roomFactory.createLivestreamRoom(roomParams)
                : this.roomFactory.createMeetingRoom(roomParams);
            await room.initRouter();
            this.rooms.set(roomId, room);
        }
        return room;
    }
    handleDisconnect(client) {
        const clientQuery = client.handshake.query;
        const { roomId } = clientQuery;
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        if (!room.peersCount) {
            room.close();
            this.rooms.delete(roomId);
        }
    }
    async handleConnection(client) {
        const clientQuery = client.handshake.query;
        const { roomId, isLivestreamRoom } = clientQuery;
        if (roomId) {
            const peerInfo = await this.getClientQuery(client);
            if (!peerInfo) {
                client.disconnect();
                return;
            }
            const room = await this.getOrCreateRoom(roomId, isLivestreamRoom === 'true');
            room.addPeer(client.id, client, peerInfo);
        }
        return `Client connected : ${client.id}`;
    }
    async handleWebrtcEvents(client, payload) {
        const peerInfo = await this.getClientQuery(client);
        if (!peerInfo) {
            client.disconnect();
            this.handleDisconnect(client);
            return;
        }
        const { roomId, isLivestreamRoom } = peerInfo;
        const room = await this.getOrCreateRoom(roomId, isLivestreamRoom);
        const { method } = payload, data = __rest(payload, ["method"]);
        return await room.handleEvent(method, Object.assign(Object.assign({}, data), { peerId: client.id }));
    }
    async listenToRoom(client, payload) {
        const { roomIds } = payload;
        for (const roomId of roomIds) {
            client.join(`RoomStatus_${roomId}`);
        }
    }
    getRoomSize(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return 0;
        return room.peersCount;
    }
    handleRoomStateCancel(roomId) {
        const room = this.rooms.get(roomId);
        const payload = {
            id: roomId,
            numberOfViewers: 0,
            status: livestream_room_enum_1.LivestreamRoomStatus.END,
        };
        this.server.to(`RoomStatus_${roomId}`).emit('roomStatusUpdated', payload);
        if (room) {
            this.server.to(roomId).emit('notification', {
                method: 'roomStatusUpdated',
                data: payload,
            });
            room.close();
            this.rooms.delete(roomId);
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", io.Server)
], WssGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [io.Socket, Object]),
    __metadata("design:returntype", Promise)
], WssGateway.prototype, "handleWebrtcEvents", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeRoomStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [io.Socket, Object]),
    __metadata("design:returntype", Promise)
], WssGateway.prototype, "listenToRoom", null);
WssGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [wss_guard_1.WssGuard,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], WssGateway);
exports.WssGateway = WssGateway;
//# sourceMappingURL=wss.gateway.js.map