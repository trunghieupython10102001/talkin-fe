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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const create_room_dto_1 = require("./dtos/create-room.dto");
const room_service_1 = require("./room.service");
const public_1 = require("../auth/decorator/public");
const swagger_1 = require("@nestjs/swagger");
const create_schedule_room_dto_1 = require("./dtos/create-schedule-room.dto");
const update_schedule_room_dto_1 = require("./dtos/update-schedule-room.dto");
const cancel_schedule_room_dto_1 = require("./dtos/cancel-schedule-room.dto");
let RoomController = class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    async createRoom(req, roomDto) {
        const creatorId = req.user.id;
        return this.roomService.createRoom(creatorId, roomDto);
    }
    async createScheduleRoom(req, roomDto) {
        const creatorId = req.user.id;
        return this.roomService.createScheduleRoom(creatorId, roomDto);
    }
    async updateScheduleRoom(req, roomDto) {
        const creatorId = req.user.id;
        return this.roomService.updateScheduleRoom(req, creatorId, roomDto);
    }
    async deleteScheduleRoom(req, query) {
        const creatorId = req.user.id;
        return this.roomService.deleteScheduleRoom(req, creatorId, query);
    }
    async getRoom(req, id) {
        return this.roomService.getRoom(req, id);
    }
};
__decorate([
    (0, swagger_1.ApiBody)({
        type: create_room_dto_1.CreateRoomDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        schema: {
            example: {
                id: '4aa05d2d-53a9-4923-9fbd-2bf8788c6a5f',
                name: 'test',
                startTime: '2023-05-31T20:00:00.000Z',
                description: 'test',
                creatorId: 1,
                createdAt: '2023-05-30T03:04:46.683Z',
                updatedAt: '2023-05-30T03:04:46.683Z',
            },
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "createRoom", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: create_schedule_room_dto_1.CreateScheduleRoomDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        schema: {
            example: {
                id: '4aa05d2d-53a9-4923-9fbd-2bf8788c6a5f',
                name: 'test',
                startTime: '2023-05-31T20:00:00.000Z',
                endTime: '2023-05-31T22:00:00.000Z',
                invitedEmails: [],
                description: 'test',
                creatorId: 1,
                createdAt: '2023-05-30T03:04:46.683Z',
                updatedAt: '2023-05-30T03:04:46.683Z',
            },
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/schedule'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_schedule_room_dto_1.CreateScheduleRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "createScheduleRoom", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_schedule_room_dto_1.UpdateScheduleRoomDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('/schedule'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_schedule_room_dto_1.UpdateScheduleRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "updateScheduleRoom", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('/schedule'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cancel_schedule_room_dto_1.CancelScheduleRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "deleteScheduleRoom", null);
__decorate([
    (0, public_1.Public)(),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        schema: {
            example: {
                id: '4aa05d2d-53a9-4923-9fbd-2bf8788c6a5f',
                name: 'test',
                startTime: '2023-05-31T20:00:00.000Z',
                description: 'test',
                creatorId: 1,
                createdAt: '2023-05-30T03:04:46.683Z',
                updatedAt: '2023-05-30T03:04:46.683Z',
            },
        },
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoom", null);
RoomController = __decorate([
    (0, swagger_1.ApiTags)('room'),
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map