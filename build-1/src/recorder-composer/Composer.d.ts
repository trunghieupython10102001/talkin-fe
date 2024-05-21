import Media, { IMediaParams } from './Media';
import Step from './Step';
declare class Composer {
    private initScript;
    private encodingOptions;
    private outputDir;
    constructor(scriptFile: string, encOpt?: EncodingOptions);
    get startTime(): number;
    private getTimestamp;
    _initMedias(mediaPaths: string[], params: IMediaParams): Media[];
    loadMedias(): Promise<Media[]>;
    private initTimeline;
    private createSteps;
    generateCommand(steps: Step[], medias: Media[]): Promise<string[]>;
    encode(): Promise<any>;
}
export default Composer;
