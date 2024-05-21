"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class Media {
    constructor(path, startTime, params) {
        this.id = -1;
        this.duration = -1;
        this.audioChannels = -1;
        this.initialized = false;
        if (!(params.hasAudio || params.hasVideo))
            throw new Error('media must contain audio or video');
        this.path = path;
        this.startTime = startTime;
        this.hasAudio = Boolean(params.hasAudio);
        this.hasVideo = Boolean(params.hasVideo);
        this.isScreen = Boolean(params.isScreen);
        this.user = params.user;
    }
    init() {
        return new Promise((resolve, reject) => {
            Promise.all([this.getEntry('format=duration'), this.hasAudio ? this.getEntry('stream=channels') : '-1'])
                .then(([duration, channels]) => {
                this.duration = Math.round(parseFloat(duration) * 1000);
                this.audioChannels = parseInt(channels, 10);
                this.initialized = true;
                resolve(true);
            })
                .catch((err) => {
                console.error('error loading video file at ', this.path, err);
                reject(err);
            });
        });
    }
    async getDuration() {
        const duration = await this.getEntry('format=duration');
        return duration;
    }
    async getNumOfChannels() {
        return await this.getEntry('stream=channels');
    }
    async getEntry(entry, log = false) {
        return new Promise((resolve, reject) => {
            const command = `ffprobe -v error -show_entries ${entry} -of default=noprint_wrappers=1:nokey=1 "${this.path}"`;
            const ls = (0, child_process_1.spawn)(command, [], { shell: true });
            ls.stdout.on('data', data => {
                if (log)
                    console.log(`stdout: ${data}`);
                resolve(data);
            });
            ls.stderr.on('data', data => {
                if (log)
                    console.log(`stderr: ${data}`);
                reject(data);
            });
            ls.on('error', (error) => {
                if (log)
                    console.log(`error: ${error.message}`);
                reject(error);
            });
            ls.on('close', code => {
                if (log)
                    console.log(`child process exited with code ${code}`);
            });
        });
    }
    setId(id) {
        this.id = id;
    }
}
exports.default = Media;
//# sourceMappingURL=Media.js.map