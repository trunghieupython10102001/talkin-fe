import { IPeer } from '../wss.interfaces';
import Room from './Room';
import { LivestreamRoomStatus } from 'src/common/constants/livestream-room.enum';
declare class LivestreamRoom extends Room {
    private streamer;
    private status;
    protected join(payload: any): Promise<{
        peers: number;
        status: LivestreamRoomStatus;
        streamer: {
            displayName: string;
            avatarUrl: string;
            description: string;
        };
    }>;
    private stopLivestream;
    protected createWebRtcTransport(payload: any): Promise<any>;
    protected produce(payload: any): Promise<any>;
    private setupStreamer;
    broadcastRoomState(): void;
    handleNewPeer(peer: IPeer): void;
    handleLeavePeer(peerId: string): void;
    get peersCount(): number;
    chat(payload: any): {
        done: boolean;
        error: string;
    } | {
        done: boolean;
        error?: undefined;
    };
}
export default LivestreamRoom;
