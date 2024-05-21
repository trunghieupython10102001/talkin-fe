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
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let MailService = class MailService {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async sendEmailInvitationMeeting(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: `Meeting Invitation: ${data.meetingName} @ ${data.startDate} ${data.startTime} - ${data.endDate} ${data.endTime} (UTC +0)`,
            template: data.description
                ? './meeting-schedule-invitation-email-with-description.html'
                : './meeting-schedule-invitation-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailUpdateMeeting(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: `Meeting Update: ${data.meetingName} @ ${data.startDate} ${data.startTime} - ${data.endDate} ${data.endTime} (UTC +0)`,
            template: data.description
                ? './meeting-schedule-update-email-with-description.html'
                : './meeting-schedule-update-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailCancelMeeting(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: `Cancelled Meeting: ${data.meetingName} @ ${data.startDate} ${data.startTime} - ${data.endDate} ${data.endTime} (UTC +0)`,
            template: data.description
                ? './meeting-schedule-cancellation-email-with-description.html'
                : './meeting-schedule-cancellation-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailInvitationLivestreamSchedule(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: `Livestream Invitation: ${data.livestreamName} @ ${data.date} ${data.startTime} (UTC +0)`,
            template: data.description
                ? './livestream-schedule-invitation-email-with-description.html'
                : './livestream-schedule-invitation-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailUpdateLivestreamSchedule(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: `Livestream Update: ${data.livestreamName} @ ${data.date} ${data.startTime} (UTC +0)`,
            template: data.description
                ? './livestream-schedule-update-email-with-description.html'
                : './livestream-schedule-update-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailCancelLivestreamSchedule(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: `Cancelled Livestream: ${data.livestreamName} @ ${data.date} ${data.startTime} (UTC +0)`,
            template: data.description
                ? './livestream-schedule-cancellation-email-with-description.html'
                : './livestream-schedule-cancellation-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailInvitationLivestreamInstant(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: `Livestream Invitation: ${data.livestreamName}`,
            template: data.description
                ? './livestream-instant-invitation-email-with-description.html'
                : './livestream-instant-invitation-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailMeetingRecordProcessing(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: data.meetingName
                ? `Meeting data from ${data.meetingName} on ${data.date} (UTC +0)`
                : `Meeting data on ${data.date} (UTC +0)`,
            template: './meeting-record-processing-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
    async sendEmailMeetingRecordFinish(data) {
        await this.mailService.sendMail({
            to: data.to,
            subject: data.meetingName
                ? `Meeting recording of ${data.meetingName} on ${data.date} (UTC +0)`
                : `Meeting recording on on ${data.date} (UTC +0)`,
            template: data.meetingName
                ? './meeting-record-finished-email-with-name.html'
                : './meeting-record-finished-email.html',
            context: Object.assign(Object.assign({}, data), { logo: '' }),
        });
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map