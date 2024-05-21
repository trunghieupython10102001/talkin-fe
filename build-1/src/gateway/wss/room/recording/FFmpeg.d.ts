export declare class FFmpeg {
    private _process;
    private _observer;
    private _outputDir;
    constructor(meetingId: string);
    getNow(): string;
    _createVideoRecorder(port: number): string;
    _createAudioRecorder(port: number): string;
    _createProcess(sdpString: string, commandArgs: string[]): void;
    get id(): number;
    kill(): void;
    get _videoArgs(): string[];
    get _audioArgs(): string[];
}
