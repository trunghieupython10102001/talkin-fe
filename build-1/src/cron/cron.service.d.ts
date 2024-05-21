import { LivestreamRoomService } from 'src/gateway/livestream/livestream.service';
export declare class CronService {
    private readonly livestreamRoomService;
    constructor(livestreamRoomService: LivestreamRoomService);
    runUpdateComingSoonLiveStream(): Promise<void>;
}
