"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFmpeg = void 0;
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const events_1 = require("events");
const sdp_1 = require("./sdp");
const utils_1 = require("./utils");
const config = require("config");
class FFmpeg {
    constructor(meetingId) {
        this._process = undefined;
        this._observer = new events_1.EventEmitter();
        this._outputDir = `${config.recorder.outputDir}/${meetingId}`;
        if (!(0, fs_1.existsSync)(this._outputDir)) {
            (0, fs_1.mkdirSync)(this._outputDir);
        }
    }
    getNow() {
        return Date.now().toString();
    }
    _createVideoRecorder(port) {
        const now = this.getNow();
        const outputPath = `${this._outputDir}/${now}.webm`;
        let commandArgs = [
            '-loglevel',
            'debug',
            '-protocol_whitelist',
            'pipe,udp,rtp',
            '-fflags',
            '+genpts',
            '-f',
            'sdp',
            '-i',
            'pipe:0',
        ];
        commandArgs = commandArgs.concat(this._videoArgs);
        commandArgs = commandArgs.concat([outputPath]);
        this._createProcess((0, sdp_1.createVideoSdpText)(port), commandArgs);
        return outputPath;
    }
    _createAudioRecorder(port) {
        const now = this.getNow();
        const outputPath = `${this._outputDir}/${now}.wav`;
        let commandArgs = [
            '-loglevel',
            'debug',
            '-protocol_whitelist',
            'pipe,udp,rtp',
            '-fflags',
            '+genpts',
            '-f',
            'sdp',
            '-i',
            'pipe:0',
        ];
        commandArgs = commandArgs.concat(this._audioArgs);
        commandArgs = commandArgs.concat([outputPath]);
        this._createProcess((0, sdp_1.createAudioSdpText)(port), commandArgs);
        return outputPath;
    }
    _createProcess(sdpString, commandArgs) {
        const sdpStream = (0, utils_1.convertStringToStream)(sdpString);
        this._process = (0, child_process_1.spawn)('ffmpeg', commandArgs);
        if (this._process.stderr) {
            this._process.stderr.setEncoding('utf-8');
            this._process.stderr.once('data', (data) => console.log('ffmpeg::process::stderr_data [data:%o]', data));
            this._process.stderr.on('data', (data) => console.log('ffmpeg::process::data [data:%o]', data));
        }
        if (this._process.stdout) {
            this._process.stdout.setEncoding('utf-8');
            this._process.stdout.once('data', (data) => console.log('ffmpeg::process::stdout_data [data:%o]', data));
            this._process.stdout.on('data', (data) => console.log('ffmpeg::process::data [data:%o]', data));
        }
        this._process.on('message', (message) => console.log('ffmpeg::process::message [message:%o]', message));
        this._process.on('error', (error) => console.error('ffmpeg::process::error [error:%o]', error));
        this._process.once('close', () => {
            console.log('ffmpeg::process::close');
            this._observer.emit('process-close');
        });
        sdpStream.on('error', (error) => console.error('sdpStream::error [error:%o]', error));
        sdpStream.resume();
        sdpStream.pipe(this._process.stdin);
    }
    get id() {
        return this._process.pid;
    }
    kill() {
        console.log('kill() [pid:%d]', this._process.pid);
        this._process.kill('SIGINT');
    }
    get _videoArgs() {
        return ['-map', '0:v:0', '-c:v', 'copy'];
    }
    get _audioArgs() {
        return [
            '-af',
            'aresample=async=1',
            '-map',
            '0:a:0',
            '-strict',
            '-2',
        ];
    }
}
exports.FFmpeg = FFmpeg;
//# sourceMappingURL=FFmpeg.js.map