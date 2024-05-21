import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomService } from './room.service';
import { Request } from 'express';
import { AuthGuardRequest } from '../auth/guards/auth.guard';
import { CreateScheduleRoomDto } from './dtos/create-schedule-room.dto';
import { UpdateScheduleRoomDto } from './dtos/update-schedule-room.dto';
import { CancelScheduleRoomDto } from './dtos/cancel-schedule-room.dto';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    createRoom(req: AuthGuardRequest, roomDto: CreateRoomDto): Promise<any>;
    createScheduleRoom(req: AuthGuardRequest, roomDto: CreateScheduleRoomDto): Promise<any>;
    updateScheduleRoom(req: AuthGuardRequest, roomDto: UpdateScheduleRoomDto): Promise<void>;
    deleteScheduleRoom(req: AuthGuardRequest, query: CancelScheduleRoomDto): Promise<void>;
    getRoom(req: Request, id: string): Promise<any>;
}
