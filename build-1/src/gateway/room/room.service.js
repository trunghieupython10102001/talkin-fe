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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../share/prisma/prisma.service");
const base_service_1 = require("../../common/base/base.service");
const config_1 = require("@nestjs/config");
const errorcode_enum_1 = require("../../common/constants/errorcode.enum");
const meeting_room_enum_1 = require("../../common/constants/meeting-room.enum");
const mail_service_1 = require("../../share/mailer/mail.service");
const schedule_email_type_enum_1 = require("../../common/constants/schedule-email-type.enum");
const utils_1 = require("../../common/utils/utils");
let RoomService = class RoomService extends base_service_1.BaseService {
    constructor(prisma, configService, mailService) {
        super(prisma, 'room', 'Room', configService);
        this.mailService = mailService;
    }
    async createRoom(creatorId, createRoomDto) {
        const roomDto = Object.assign(Object.assign({}, createRoomDto), { creatorId, startTime: createRoomDto.startTime
                ? new Date(createRoomDto.startTime)
                : undefined });
        const newRoom = await this.create(Object.assign({ creatorId }, roomDto));
        return newRoom;
    }
    async createScheduleRoom(creatorId, createScheduleRoomDto) {
        const roomDto = Object.assign(Object.assign({}, createScheduleRoomDto), { creatorId, startTime: new Date(createScheduleRoomDto.startTime), endTime: new Date(createScheduleRoomDto.endTime) });
        const hasSendMail = roomDto.hasSendMail;
        delete roomDto.hasSendMail;
        if (roomDto.startTime >= roomDto.endTime) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.END_TIME_MUST_GREATER_THAN_START_TIME,
            });
        }
        if (roomDto.startTime < new Date()) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.START_TIME_MUST_GREATER_THAN_CURRENT_TIME,
            });
        }
        const newRoom = await this.create(Object.assign({ creatorId }, roomDto));
        if (hasSendMail) {
            void this.sendMailScheduleMeeting({
                type: schedule_email_type_enum_1.ScheduleEmailType.CREATE,
                newInvitedEmails: newRoom.invitedEmails || [],
                oldInvitedMemberEmails: [],
                meetingId: newRoom.id,
                meetingName: newRoom.name,
                description: newRoom.description,
                startTime: newRoom.startTime,
                endTime: newRoom.endTime,
            });
        }
        return newRoom;
    }
    async updateScheduleRoom(request, creatorId, updateScheduleRoomDto) {
        const roomId = updateScheduleRoomDto.id;
        const hasSendMail = updateScheduleRoomDto.hasSendMail;
        const oldRoom = await this.get(request, roomId);
        if ((oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.creatorId) != creatorId) {
            throw new common_1.UnauthorizedException();
        }
        if ((oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.status) == meeting_room_enum_1.MeetingRoomStatus.CLOSED) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.MEETING_ROOM_CANCELLED,
            });
        }
        const roomDto = Object.assign(Object.assign({}, updateScheduleRoomDto), { creatorId, startTime: new Date(updateScheduleRoomDto.startTime), endTime: new Date(updateScheduleRoomDto.endTime) });
        if (roomDto.startTime >= roomDto.endTime) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.END_TIME_MUST_GREATER_THAN_START_TIME,
            });
        }
        if (roomDto.startTime < new Date()) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.START_TIME_MUST_GREATER_THAN_CURRENT_TIME,
            });
        }
        delete roomDto.hasSendMail;
        delete roomDto.id;
        await this.update({}, roomId, roomDto);
        if (hasSendMail) {
            let checkUpdateContent = false;
            if (roomDto.startTime != new Date(oldRoom.startTime) ||
                roomDto.endTime != new Date(oldRoom.endTime) ||
                (roomDto.description || null) != (oldRoom.description || null) ||
                roomDto.name != oldRoom.name) {
                checkUpdateContent = true;
            }
            const scheduleEmailType = checkUpdateContent
                ? schedule_email_type_enum_1.ScheduleEmailType.UPDATE_CONTENT
                : schedule_email_type_enum_1.ScheduleEmailType.UPDATE_GUEST;
            void this.sendMailScheduleMeeting({
                type: scheduleEmailType,
                newInvitedEmails: roomDto.invitedEmails || [],
                oldInvitedMemberEmails: oldRoom.invitedEmails || [],
                meetingId: roomId,
                meetingName: roomDto.name,
                description: roomDto.description,
                startTime: roomDto.startTime,
                endTime: roomDto.endTime,
            });
        }
    }
    async deleteScheduleRoom(request, creatorId, query) {
        const roomId = query.id;
        request.query = {};
        const oldRoom = await this.get(request, roomId);
        if ((oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.creatorId) != creatorId) {
            throw new common_1.UnauthorizedException();
        }
        if ((oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.status) == meeting_room_enum_1.MeetingRoomStatus.CLOSED) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.MEETING_ROOM_CANCELLED,
            });
        }
        const roomDto = {
            status: meeting_room_enum_1.MeetingRoomStatus.CLOSED,
        };
        await this.update({}, roomId, roomDto);
        if (query.hasSendMail && query.hasSendMail != 'false') {
            void this.sendMailScheduleMeeting({
                type: schedule_email_type_enum_1.ScheduleEmailType.CANCEL,
                newInvitedEmails: oldRoom.invitedEmails || [],
                oldInvitedMemberEmails: oldRoom.invitedEmails || [],
                meetingId: oldRoom.id,
                meetingName: oldRoom.name,
                description: oldRoom.description,
                startTime: oldRoom.startTime,
                endTime: oldRoom.endTime,
            });
        }
    }
    async getRoom(request, roomId) {
        const room = await this.get(request, roomId);
        if (!room) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.ROOM_NOT_EXISTED,
            });
        }
        if ((room === null || room === void 0 ? void 0 : room.status) == meeting_room_enum_1.MeetingRoomStatus.CLOSED) {
            throw new common_1.BadRequestException({
                message: errorcode_enum_1.ErrorCode.MEETING_ROOM_CANCELLED,
            });
        }
        return room;
    }
    getMeetingLink(roomId) {
        return process.env.DOMAIN + 'waiting-room/' + roomId;
    }
    async sendMailScheduleMeeting({ type, newInvitedEmails, oldInvitedMemberEmails, meetingId, meetingName, description, startTime, endTime, }) {
        const startDate = (0, utils_1.getFormattedDate)(startTime);
        const endDate = (0, utils_1.getFormattedDate)(endTime);
        const startTimeString = (0, utils_1.getFormattedHourAndMinute)(startTime);
        const endTimeString = (0, utils_1.getFormattedHourAndMinute)(endTime);
        const emailContext = {
            meetingName,
            startDate,
            endDate,
            startTime: startTimeString,
            endTime: endTimeString,
            description,
            meetingLink: this.getMeetingLink(meetingId),
            meetingId,
            to: '',
        };
        if (type === schedule_email_type_enum_1.ScheduleEmailType.CREATE) {
            if (newInvitedEmails.length) {
                emailContext.to = newInvitedEmails.join(',');
                await this.mailService.sendEmailInvitationMeeting(emailContext);
            }
        }
        else if (type === schedule_email_type_enum_1.ScheduleEmailType.UPDATE_GUEST ||
            type === schedule_email_type_enum_1.ScheduleEmailType.UPDATE_CONTENT) {
            const newEmails = newInvitedEmails.filter((x) => !oldInvitedMemberEmails.includes(x));
            if (newEmails.length) {
                emailContext.to = newEmails.join(',');
                await this.mailService.sendEmailInvitationMeeting(emailContext);
            }
            const removeEmails = oldInvitedMemberEmails.filter((x) => !newInvitedEmails.includes(x));
            if (removeEmails.length) {
                emailContext.to = removeEmails.join(',');
                await this.mailService.sendEmailCancelMeeting(emailContext);
            }
            if (type === schedule_email_type_enum_1.ScheduleEmailType.UPDATE_CONTENT) {
                const updateEmails = oldInvitedMemberEmails.filter((x) => newInvitedEmails.includes(x));
                if (updateEmails.length) {
                    emailContext.to = updateEmails.join(',');
                    await this.mailService.sendEmailUpdateMeeting(emailContext);
                }
            }
        }
        else if (type === schedule_email_type_enum_1.ScheduleEmailType.CANCEL) {
            if (oldInvitedMemberEmails === null || oldInvitedMemberEmails === void 0 ? void 0 : oldInvitedMemberEmails.length) {
                emailContext.to = oldInvitedMemberEmails.join(',');
                await this.mailService.sendEmailCancelMeeting(emailContext);
            }
        }
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mail_service_1.MailService])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map