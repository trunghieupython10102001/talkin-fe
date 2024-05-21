import Media from './Media';
export default class Step {
    readonly id: string;
    readonly mediaList: Media[];
    readonly startTime: number;
    readonly duration: number;
    readonly size: Size;
    readonly displayName?: string;
    private readonly layout;
    constructor(id: string, mediaList: Media[], startTime: number, endTime: number, size: Size, displayName?: string);
    generateFilter(): string;
}
