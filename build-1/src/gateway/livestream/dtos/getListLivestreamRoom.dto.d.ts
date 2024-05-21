import { LivestreamRoomStatus } from 'src/common/constants/livestream-room.enum';
export declare class ListLiveStreamRoomDto {
    status?: LivestreamRoomStatus;
    order_by?: string;
    sort_by?: string;
    name_like?: string;
    'creator.fullname_like'?: string;
    listCategory_has?: string[];
}
