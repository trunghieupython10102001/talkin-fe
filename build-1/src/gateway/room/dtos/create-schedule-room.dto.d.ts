import { MeetingRoomType } from 'src/common/constants/meeting-room.enum';
export declare class CreateScheduleRoomDto {
    name: string;
    startTime: string;
    endTime: string;
    type?: MeetingRoomType;
    invitedEmails?: string[];
    description?: string;
    hasSendMail?: boolean;
}
