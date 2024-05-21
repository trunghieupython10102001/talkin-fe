import { RoomParams } from '../wss.interfaces';
import LivestreamRoom from './LivestreamRoom';
import MeetingRoom from './MeetingRoom';
declare class RoomFactory {
    createMeetingRoom(params: RoomParams): MeetingRoom;
    createLivestreamRoom(params: RoomParams): LivestreamRoom;
}
export default RoomFactory;
