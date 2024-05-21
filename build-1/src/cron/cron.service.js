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
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const livestream_service_1 = require("../gateway/livestream/livestream.service");
const livestream_room_enum_1 = require("../common/constants/livestream-room.enum");
let CronService = class CronService {
    constructor(livestreamRoomService) {
        this.livestreamRoomService = livestreamRoomService;
    }
    async runUpdateComingSoonLiveStream() {
        try {
            console.log('[CRON] update comingSoon LiveStreams start');
            const currentTimeMinus1h = new Date(new Date().getTime() - 60 * 60 * 1000);
            const query = {
                status: livestream_room_enum_1.LivestreamRoomStatus.COMING_SOON,
                startTime: { lte: currentTimeMinus1h },
            };
            const comingSoonRooms = await this.livestreamRoomService.getAllByQuery(query);
            if (comingSoonRooms === null || comingSoonRooms === void 0 ? void 0 : comingSoonRooms.length) {
                const updateIds = comingSoonRooms.map((room) => room.id);
                const updateQuery = {
                    id: {
                        in: updateIds,
                    },
                };
                await this.livestreamRoomService.updateByQuery(updateQuery, {
                    status: livestream_room_enum_1.LivestreamRoomStatus.CANCELLED,
                });
                console.log(`[CRON] updated ${updateIds.length} comingSoon LiveStreams to Canceled`);
            }
            else {
                console.log('[CRON] no comingSoon LiveStreams updated');
            }
        }
        catch (error) {
            console.log('[CRON] update comingSoon LiveStreams ERROR: ', error);
        }
    }
};
__decorate([
    (0, schedule_1.Interval)(5 * 60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "runUpdateComingSoonLiveStream", null);
CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [livestream_service_1.LivestreamRoomService])
], CronService);
exports.CronService = CronService;
//# sourceMappingURL=cron.service.js.map