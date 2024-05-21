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
exports.LivestreamRoomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../share/prisma/prisma.service");
const base_service_1 = require("../../common/base/base.service");
const config_1 = require("@nestjs/config");
const errorcode_enum_1 = require("../../common/constants/errorcode.enum");
const livestream_room_enum_1 = require("../../common/constants/livestream-room.enum");
const wss_gateway_1 = require("../wss/wss.gateway");
const lib_1 = require("../../common/lib");
const utils_1 = require("../../common/utils/utils");
const schedule_email_type_enum_1 = require("../../common/constants/schedule-email-type.enum");
const mail_service_1 = require("../../share/mailer/mail.service");
let LivestreamRoomService = class LivestreamRoomService extends base_service_1.BaseService {
    constructor(prisma, configService, mailService) {
        super(prisma, 'livestreamRoom', 'LivestreamRoom', configService);
        this.mailService = mailService;
    }
    async getLiveStreamRoomById(request, id) {
        const livestreamRoom = await this.get(request, id);
        if (!livestreamRoom) {
            throw new common_1.NotFoundException({
                message: errorcode_enum_1.ErrorCode.ROOM_NOT_EXISTED,
            });
        }
        if ((livestreamRoom === null || livestreamRoom === void 0 ? void 0 : livestreamRoom.status) == livestream_room_enum_1.LivestreamRoomStatus.END ||
            (livestreamRoom === null || livestreamRoom === void 0 ? void 0 : livestreamRoom.status) == livestream_room_enum_1.LivestreamRoomStatus.CANCELLED) {
            throw new common_1.NotFoundException({
                message: errorcode_enum_1.ErrorCode.LIVESTREAM_ROOM_ENDED,
            });
        }
        (0, lib_1.exclude)(livestreamRoom.creator, ['password', 'createdAt', 'updatedAt']);
        return Object.assign(Object.assign({}, livestreamRoom), { peersCount: this.wssGateway.getRoomSize(id) });
    }
    async createLiveStreamRoom(creatorId, createLiveStreamRoomDto, thumbnail) {
        const { listCategory, startTime, invitedEmails, hasSendMail } = createLiveStreamRoomDto;
        const newLiveStreamDto = Object.assign(Object.assign({}, createLiveStreamRoomDto), { creatorId,
            thumbnail, listCategory: listCategory
                ? listCategory.toString().split(',')
                : undefined, startTime: startTime ? new Date(startTime) : undefined });
        (0, lib_1.exclude)(newLiveStreamDto, ['hasSendMail']);
        const newLiveStream = await this.create(Object.assign({ creatorId }, newLiveStreamDto));
        if (invitedEmails && hasSendMail) {
            if (startTime) {
                this.sendMailScheduleLivestream({
                    type: schedule_email_type_enum_1.ScheduleEmailType.CREATE,
                    newInvitedEmails: newLiveStream.invitedEmails,
                    oldInvitedMemberEmails: [],
                    livestreamName: newLiveStream.name,
                    description: newLiveStream.description,
                    startTime: newLiveStream.startTime,
                    livestreamId: newLiveStream.id,
                    category: newLiveStream.listCategory,
                });
            }
            else {
                void this.mailService.sendEmailInvitationLivestreamInstant({
                    category: listCategory,
                    livestreamName: newLiveStream.name,
                    to: newLiveStreamDto.invitedEmails.join(','),
                    livestreamLink: this.getLivestreamLink(newLiveStream.id),
                    description: newLiveStreamDto.description,
                });
            }
        }
        return newLiveStream;
    }
    async getAllLivestream(req) {
        req.query.status_notin = `${livestream_room_enum_1.LivestreamRoomStatus.CANCELLED},${livestream_room_enum_1.LivestreamRoomStatus.END}`;
        const livestreamRooms = await this.getAll(req);
        const newData = livestreamRooms.data.map((room) => {
            (0, lib_1.exclude)(room.creator, ['password', 'createdAt', 'updatedAt']);
            return Object.assign(Object.assign({}, room), { peersCount: this.wssGateway.getRoomSize(room.id) });
        });
        return {
            meta: livestreamRooms.meta,
            data: newData,
        };
    }
    async sendMailScheduleLivestream({ type, newInvitedEmails, oldInvitedMemberEmails, livestreamName, description, startTime, livestreamId, category, }) {
        const date = (0, utils_1.getFormattedDate)(startTime);
        const startTimeString = (0, utils_1.getFormattedHourAndMinute)(startTime);
        const emailContext = {
            livestreamName,
            date,
            startTime: startTimeString,
            description,
            livestreamLink: this.getLivestreamLink(livestreamId),
            to: '',
            category,
        };
        if (type === schedule_email_type_enum_1.ScheduleEmailType.CREATE) {
            if (newInvitedEmails.length) {
                emailContext.to = newInvitedEmails.join(',');
                await this.mailService.sendEmailInvitationLivestreamSchedule(emailContext);
            }
        }
        else if (type === schedule_email_type_enum_1.ScheduleEmailType.UPDATE_GUEST ||
            type === schedule_email_type_enum_1.ScheduleEmailType.UPDATE_CONTENT) {
            const newEmails = newInvitedEmails.filter((x) => !oldInvitedMemberEmails.includes(x));
            if (newEmails.length) {
                emailContext.to = newEmails.join(',');
                await this.mailService.sendEmailInvitationLivestreamSchedule(emailContext);
            }
            const removeEmails = oldInvitedMemberEmails.filter((x) => !newInvitedEmails.includes(x));
            if (removeEmails.length) {
                emailContext.to = removeEmails.join(',');
                await this.mailService.sendEmailCancelLivestreamSchedule(emailContext);
            }
            if (type === schedule_email_type_enum_1.ScheduleEmailType.UPDATE_CONTENT) {
                const updateEmails = oldInvitedMemberEmails.filter((x) => newInvitedEmails.includes(x));
                if (updateEmails.length) {
                    emailContext.to = updateEmails.join(',');
                    await this.mailService.sendEmailUpdateLivestreamSchedule(emailContext);
                }
            }
        }
        else if (type === schedule_email_type_enum_1.ScheduleEmailType.CANCEL) {
            if (oldInvitedMemberEmails === null || oldInvitedMemberEmails === void 0 ? void 0 : oldInvitedMemberEmails.length) {
                emailContext.to = oldInvitedMemberEmails.join(',');
                await this.mailService.sendEmailCancelLivestreamSchedule(emailContext);
            }
        }
    }
    getLivestreamLink(livestreamId) {
        return process.env.DOMAIN + 'livestream/viewer/' + livestreamId;
    }
    hasArrayChanged(preArr, currentArr) {
        if (preArr.length !== currentArr.length)
            return true;
        if (preArr.length === 0)
            return false;
        return !preArr.every((item) => currentArr.includes(item));
    }
    hasContentChanged(preLiveStream, currentLiveStream) {
        const { name, description, startTime, listCategory } = currentLiveStream;
        const hasCategoryChanged = this.hasArrayChanged(preLiveStream.listCategory, listCategory);
        return (preLiveStream.name !== name ||
            preLiveStream.description !== description ||
            preLiveStream.startTime !== startTime ||
            hasCategoryChanged);
    }
    async updateScheduleLivestream(req, creatorId, currentLivestream, thumbnail) {
        const { id: livestreamId, hasSendMail } = currentLivestream;
        if (currentLivestream.startTime < new Date()) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.START_TIME_MUST_GREATER_THAN_CURRENT_TIME,
            });
        }
        const oldLivestream = await this.get(req, livestreamId);
        if ((oldLivestream === null || oldLivestream === void 0 ? void 0 : oldLivestream.creatorId) != creatorId) {
            throw new common_1.UnauthorizedException();
        }
        if ((oldLivestream === null || oldLivestream === void 0 ? void 0 : oldLivestream.status) === livestream_room_enum_1.LivestreamRoomStatus.END ||
            (oldLivestream === null || oldLivestream === void 0 ? void 0 : oldLivestream.status) === livestream_room_enum_1.LivestreamRoomStatus.CANCELLED) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.LIVESTREAM_ROOM_ENDED,
            });
        }
        const updatedLivestreamRoom = Object.assign(Object.assign({}, currentLivestream), { startTime: currentLivestream.startTime
                ? new Date(currentLivestream.startTime)
                : oldLivestream.startTime, thumbnail });
        (0, lib_1.exclude)(updatedLivestreamRoom, ['hasSendMail']);
        const newLivestreamRoom = await this.update({}, livestreamId, updatedLivestreamRoom);
        if (hasSendMail && hasSendMail != 'false') {
            const isContentChanged = this.hasContentChanged(oldLivestream, updatedLivestreamRoom);
            const scheduleEmailType = isContentChanged
                ? schedule_email_type_enum_1.ScheduleEmailType.UPDATE_CONTENT
                : schedule_email_type_enum_1.ScheduleEmailType.UPDATE_GUEST;
            this.sendMailScheduleLivestream({
                type: scheduleEmailType,
                newInvitedEmails: updatedLivestreamRoom.invitedEmails,
                oldInvitedMemberEmails: oldLivestream.invitedEmails,
                livestreamName: updatedLivestreamRoom.name,
                description: updatedLivestreamRoom.description,
                startTime: updatedLivestreamRoom.startTime,
                livestreamId: updatedLivestreamRoom.id,
                category: updatedLivestreamRoom.listCategory,
            });
        }
        return newLivestreamRoom;
    }
    async deleteScheduleLiveStream(req, creatorId, query) {
        const { id: livestreamId, hasSendMail } = query;
        req.query = {};
        const oldLivestream = await this.get(req, livestreamId);
        if ((oldLivestream === null || oldLivestream === void 0 ? void 0 : oldLivestream.creatorId) != creatorId) {
            throw new common_1.UnauthorizedException();
        }
        if ((oldLivestream === null || oldLivestream === void 0 ? void 0 : oldLivestream.status) === livestream_room_enum_1.LivestreamRoomStatus.END ||
            (oldLivestream === null || oldLivestream === void 0 ? void 0 : oldLivestream.status) === livestream_room_enum_1.LivestreamRoomStatus.CANCELLED) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.LIVESTREAM_ROOM_ENDED,
            });
        }
        if ((oldLivestream === null || oldLivestream === void 0 ? void 0 : oldLivestream.status) === livestream_room_enum_1.LivestreamRoomStatus.LIVE) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.CAN_NOT_CANCEL_LIVE_ROOM,
            });
        }
        const updatedLivestreamRoom = {
            status: livestream_room_enum_1.LivestreamRoomStatus.CANCELLED,
        };
        await this.update({}, livestreamId, updatedLivestreamRoom);
        if (hasSendMail) {
            this.sendMailScheduleLivestream({
                type: schedule_email_type_enum_1.ScheduleEmailType.CANCEL,
                newInvitedEmails: oldLivestream.invitedEmails,
                oldInvitedMemberEmails: oldLivestream.invitedEmails,
                livestreamName: oldLivestream.name,
                description: oldLivestream.description,
                startTime: oldLivestream.startTime,
                livestreamId: oldLivestream.id,
                category: oldLivestream.listCategory,
            });
        }
        void this.wssGateway.handleRoomStateCancel(livestreamId);
    }
};
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", wss_gateway_1.WssGateway)
], LivestreamRoomService.prototype, "wssGateway", void 0);
LivestreamRoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mail_service_1.MailService])
], LivestreamRoomService);
exports.LivestreamRoomService = LivestreamRoomService;
//# sourceMappingURL=livestream.service.js.map