import { PrismaService } from 'src/share/prisma/prisma.service';
import { BaseService } from 'src/common/base/base.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CreateLiveStreamRoomDto } from './dtos/createLivestreamRoom.dto';
import { WssGateway } from '../wss/wss.gateway';
import { AuthGuardRequest } from '../auth/guards/auth.guard';
import { ScheduleEmailType } from 'src/common/constants/schedule-email-type.enum';
import { MailService } from 'src/share/mailer/mail.service';
import { UpdateLivestreamRoomDTO } from './dtos/updateLivestreamRoom.dto';
import { CancelLivestreamRoomDto } from './dtos/cancelLivestreamRoom.dto';
export declare class LivestreamRoomService extends BaseService {
    private mailService;
    protected wssGateway: WssGateway;
    constructor(prisma: PrismaService, configService: ConfigService, mailService: MailService);
    getLiveStreamRoomById(request: Request, id: string): Promise<any>;
    createLiveStreamRoom(creatorId: number, createLiveStreamRoomDto: CreateLiveStreamRoomDto, thumbnail?: string): Promise<any>;
    getAllLivestream(req: Request): Promise<{
        meta: any;
        data: any;
    }>;
    sendMailScheduleLivestream({ type, newInvitedEmails, oldInvitedMemberEmails, livestreamName, description, startTime, livestreamId, category, }: {
        type: ScheduleEmailType;
        newInvitedEmails: string[];
        oldInvitedMemberEmails: string[];
        livestreamName: string;
        description?: string;
        startTime: Date;
        livestreamId: string;
        category: string[];
    }): Promise<void>;
    getLivestreamLink(livestreamId: string): string;
    hasArrayChanged(preArr: any[], currentArr: any[]): boolean;
    hasContentChanged(preLiveStream: any, currentLiveStream: any): boolean;
    updateScheduleLivestream(req: AuthGuardRequest, creatorId: number, currentLivestream: UpdateLivestreamRoomDTO, thumbnail?: string): Promise<any>;
    deleteScheduleLiveStream(req: AuthGuardRequest, creatorId: number, query: CancelLivestreamRoomDto): Promise<void>;
}
