import { IPeer } from '../wss.interfaces';
import Room from './Room';
declare class MeetingRoom extends Room {
    private recorder;
    handleNewPeer(peer: IPeer): void;
    protected join(payload: any): {
        peers: {
            id: string;
            displayName: string;
            device: any;
            isGuest: boolean;
            isHost: boolean;
            avatarUrl: string;
        }[];
        isHost: boolean;
        isRecording: boolean;
        presenter: any;
    };
    protected mutePeer(payload: any): Promise<boolean>;
    protected removePeerByHost(payload: any): Promise<boolean>;
    protected produce(payload: any): Promise<{
        id: string;
    }>;
    protected requestRecord(payload: any): Promise<boolean>;
    protected stopRecord(payload: any): Promise<boolean>;
    private handleStopRecord;
    removePeer(peerId: string): void;
    close(): void;
    private handleStopRecordComposeAndSendMail;
    private sendMailRecordFinish;
    private sendMailRecord;
    private handleStartRecord;
    private createLocalTransport;
    private publishProducerRtpStream;
}
export default MeetingRoom;
