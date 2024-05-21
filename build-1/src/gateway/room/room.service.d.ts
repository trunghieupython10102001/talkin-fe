import { PrismaService } from 'src/share/prisma/prisma.service';
import { BaseService } from 'src/common/base/base.service';
import { ConfigService } from '@nestjs/config';
import { CreateRoomDto } from './dtos/create-room.dto';
import { CreateScheduleRoomDto } from './dtos/create-schedule-room.dto';
import { UpdateScheduleRoomDto } from './dtos/update-schedule-room.dto';
import { AuthGuardRequest } from '../auth/guards/auth.guard';
import { MailService } from 'src/share/mailer/mail.service';
import { ScheduleEmailType } from 'src/common/constants/schedule-email-type.enum';
import { CancelScheduleRoomDto } from './dtos/cancel-schedule-room.dto';
export declare class RoomService extends BaseService {
    private mailService;
    constructor(prisma: PrismaService, configService: ConfigService, mailService: MailService);
    createRoom(creatorId: number, createRoomDto: CreateRoomDto): Promise<any>;
    createScheduleRoom(creatorId: number, createScheduleRoomDto: CreateScheduleRoomDto): Promise<any>;
    updateScheduleRoom(request: AuthGuardRequest, creatorId: number, updateScheduleRoomDto: UpdateScheduleRoomDto): Promise<void>;
    deleteScheduleRoom(request: AuthGuardRequest, creatorId: number, query: CancelScheduleRoomDto): Promise<void>;
    getRoom(request: AuthGuardRequest, roomId: string): Promise<any>;
    getMeetingLink(roomId: string): string;
    sendMailScheduleMeeting({ type, newInvitedEmails, oldInvitedMemberEmails, meetingId, meetingName, description, startTime, endTime, }: {
        type: ScheduleEmailType;
        newInvitedEmails: string[];
        oldInvitedMemberEmails: string[];
        meetingId: string;
        meetingName: string;
        description?: string;
        startTime: Date;
        endTime: Date;
    }): Promise<void>;
}
