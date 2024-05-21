import { MailerService } from '@nestjs-modules/mailer';
import { LivestreamInstantEmailContext, LivestreamScheduleEmailContext, MeetingEmailContext, MeetingRecordEmailContext } from './mail-context.interface';
export declare class MailService {
    private readonly mailService;
    constructor(mailService: MailerService);
    sendEmailInvitationMeeting(data: MeetingEmailContext): Promise<void>;
    sendEmailUpdateMeeting(data: MeetingEmailContext): Promise<void>;
    sendEmailCancelMeeting(data: MeetingEmailContext): Promise<void>;
    sendEmailInvitationLivestreamSchedule(data: LivestreamScheduleEmailContext): Promise<void>;
    sendEmailUpdateLivestreamSchedule(data: LivestreamScheduleEmailContext): Promise<void>;
    sendEmailCancelLivestreamSchedule(data: LivestreamScheduleEmailContext): Promise<void>;
    sendEmailInvitationLivestreamInstant(data: LivestreamInstantEmailContext): Promise<void>;
    sendEmailMeetingRecordProcessing(data: MeetingRecordEmailContext): Promise<void>;
    sendEmailMeetingRecordFinish(data: MeetingRecordEmailContext): Promise<void>;
}
