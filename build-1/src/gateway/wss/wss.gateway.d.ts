import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Worker } from 'mediasoup/node/lib/Worker';
import * as io from 'socket.io';
import Room from './room/Room';
import { WssGuard } from './wss.guard';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { MailService } from 'src/share/mailer/mail.service';
export declare class WssGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private wssGuard;
    private prismaService;
    private mailService;
    server: io.Server;
    private roomFactory;
    rooms: Map<string, Room>;
    workers: {
        [index: number]: {
            clientsCount: number;
            roomsCount: number;
            pid: number;
            worker: Worker;
        };
    };
    constructor(wssGuard: WssGuard, prismaService: PrismaService, mailService: MailService);
    private createWorker;
    private createWorkers;
    private getOptimalWorkerIndex;
    private getClientQuery;
    private getOrCreateRoom;
    handleDisconnect(client: io.Socket): void;
    handleConnection(client: io.Socket): Promise<string>;
    handleWebrtcEvents(client: io.Socket, payload: any): Promise<any>;
    listenToRoom(client: io.Socket, payload: any): Promise<void>;
    getRoomSize(roomId: string): number;
    handleRoomStateCancel(roomId: string): void;
}
