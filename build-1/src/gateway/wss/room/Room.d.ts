import { Router, Worker, AudioLevelObserver } from 'mediasoup/node/lib/types';
import * as io from 'socket.io';
import { IPeer, IPeerInfo, ICreateConsumerArgs } from '../wss.interfaces';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { MailService } from 'src/share/mailer/mail.service';
declare abstract class Room {
    private worker;
    workerIndex: number;
    readonly id: string;
    protected readonly wssServer: io.Server;
    protected prismaService: PrismaService;
    protected mailService: MailService;
    readonly peers: Map<string, IPeer>;
    router: Router;
    protected presenter: any;
    protected audioLevelObserver: AudioLevelObserver;
    constructor(worker: Worker, workerIndex: number, id: string, wssServer: io.Server, prismaService: PrismaService, mailService: MailService);
    initRouter(): Promise<void>;
    protected getRouterRtpCapabilities(): import("mediasoup/node/lib/RtpParameters").RtpCapabilities;
    protected createWebRtcTransport(payload: any): Promise<{
        id: string;
        iceParameters: import("mediasoup/node/lib/WebRtcTransport").IceParameters;
        iceCandidates: import("mediasoup/node/lib/WebRtcTransport").IceCandidate[];
        dtlsParameters: import("mediasoup/node/lib/WebRtcTransport").DtlsParameters;
        sctpParameters: import("mediasoup/node/lib/SctpParameters").SctpParameters;
    }>;
    protected connectWebRtcTransport(payload: any): Promise<{
        msg: string;
        ok: boolean;
    }>;
    protected produce(payload: any): Promise<{
        id: string;
    }>;
    protected createConsumer(args: ICreateConsumerArgs): Promise<void>;
    protected restartIce(payload: any): Promise<import("mediasoup/node/lib/WebRtcTransport").IceParameters>;
    protected pauseProducer(payload: any): Promise<{
        done: boolean;
    }>;
    protected closeProducer(payload: any): Promise<{
        done: boolean;
    }>;
    protected resumeProducer(payload: any): Promise<{
        done: boolean;
    }>;
    protected chat(payload: any): {
        done: boolean;
    };
    protected abstract join(payload: any): any;
    protected handleNewPeer(peer: IPeer): void;
    addPeer(peerId: string, socket: io.Socket, peerInfo: IPeerInfo): void;
    getPeer(peerId: string): IPeer;
    getAllPeers(): Map<string, IPeer>;
    handleLeavePeer(peerId: string): void;
    removePeer(peerId: string): void;
    getPeers({ excludeId }: {
        excludeId: string;
    }): IPeer[];
    get peersCount(): number;
    close(): void;
    getJoinedPeers({ excludeId }: {
        excludeId: string;
    }): IPeer[];
    notifyPeer(peer: io.Socket, eventName: string, payload: any): void;
    protected broadcast(eventName: string, payload: any): void;
    handleEvent(eventName: string, payload: any): Promise<any>;
}
export default Room;
