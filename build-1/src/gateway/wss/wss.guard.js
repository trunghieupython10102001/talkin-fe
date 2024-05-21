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
exports.WssGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../share/prisma/prisma.service");
const livestream_room_enum_1 = require("../../common/constants/livestream-room.enum");
const meeting_room_enum_1 = require("../../common/constants/meeting-room.enum");
let WssGuard = class WssGuard {
    constructor(jwtService, prismaService) {
        this.jwtService = jwtService;
        this.prismaService = prismaService;
    }
    async verifyClientQuery(clientQuery) {
        const { accessToken, roomId, isLivestreamRoom, device } = clientQuery;
        let creatorId;
        if (isLivestreamRoom === 'true') {
            const liveStreamRoom = await this.prismaService.livestreamRoom.findFirst({
                where: { id: roomId },
            });
            if (!liveStreamRoom ||
                liveStreamRoom.status == livestream_room_enum_1.LivestreamRoomStatus.CANCELLED ||
                liveStreamRoom.status == livestream_room_enum_1.LivestreamRoomStatus.END)
                throw new common_1.NotFoundException();
            creatorId = liveStreamRoom.creatorId;
        }
        else {
            const room = await this.prismaService.room.findFirst({
                where: { id: roomId },
            });
            if (!room || room.status == meeting_room_enum_1.MeetingRoomStatus.CLOSED)
                throw new common_1.NotFoundException();
            creatorId = room.creatorId;
        }
        if (!accessToken)
            return {
                roomId,
                isLivestreamRoom: isLivestreamRoom === 'true',
                device,
                isGuest: true,
            };
        try {
            const userDecode = await this.jwtService.verifyAsync(accessToken, {
                secret: process.env.JWT_SECRET,
            });
            const user = await this.prismaService.user.findFirst({
                where: { id: userDecode === null || userDecode === void 0 ? void 0 : userDecode.id },
            });
            if (!user)
                throw new common_1.UnauthorizedException();
            return {
                userId: user.id.toString(),
                displayName: user.firstname + ' ' + user.lastname,
                avatarUrl: user.avatar,
                description: user.id === creatorId ? user.description : undefined,
                roomId,
                isLivestreamRoom: isLivestreamRoom === 'true',
                device,
                isHost: user.id === creatorId,
            };
        }
        catch (_a) {
            throw new common_1.UnauthorizedException();
        }
    }
};
WssGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], WssGuard);
exports.WssGuard = WssGuard;
//# sourceMappingURL=wss.guard.js.map