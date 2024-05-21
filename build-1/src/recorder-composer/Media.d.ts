import User from './User';
export interface IMediaParams {
    hasAudio?: boolean;
    hasVideo?: boolean;
    isScreen?: boolean;
    user?: User;
}
export default class Media {
    readonly path: string;
    readonly hasAudio?: boolean;
    readonly hasVideo?: boolean;
    readonly startTime: number;
    readonly isScreen: boolean;
    user?: User;
    id: number;
    duration: number;
    audioChannels: number;
    initialized: boolean;
    constructor(path: string, startTime: number, params: IMediaParams);
    init(): PromiseLike<any>;
    getDuration(): Promise<string>;
    getNumOfChannels(): Promise<string>;
    getEntry(entry: string, log?: boolean): Promise<string>;
    setId(id: number): void;
}
