/// <reference types="multer" />
import { LivestreamRoomService } from './livestream.service';
import { Request } from 'express';
import { AuthGuardRequest } from '../auth/guards/auth.guard';
import { UpdateLivestreamRoomDTO } from './dtos/updateLivestreamRoom.dto';
import { CreateLiveStreamRoomDto } from './dtos/createLivestreamRoom.dto';
import { CancelLivestreamRoomDto } from './dtos/cancelLivestreamRoom.dto';
export declare class LiveStreamRoomController {
    private readonly livestreamRoomService;
    constructor(livestreamRoomService: LivestreamRoomService);
    getAll(req: Request): Promise<{
        meta: any;
        data: any;
    }>;
    getById(req: Request, id: string): Promise<any>;
    createLivestreamRoom(thumbnail: Express.Multer.File, req: AuthGuardRequest, createLiveStreamRoomDto: CreateLiveStreamRoomDto): Promise<any>;
    updateScheduleLivestream(thumbnail: Express.Multer.File, req: AuthGuardRequest, liveStream: UpdateLivestreamRoomDTO): Promise<any>;
    deleteScheduleLivestream(req: AuthGuardRequest, query: CancelLivestreamRoomDto): Promise<void>;
}
