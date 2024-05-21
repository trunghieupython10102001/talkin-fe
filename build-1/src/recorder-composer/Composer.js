"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const path_1 = require("path");
const fs_1 = require("fs");
const Media_1 = require("./Media");
const Step_1 = require("./Step");
const CommandExecutor_1 = require("./CommandExecutor");
class Composer {
    constructor(scriptFile, encOpt) {
        const data = (0, fs_1.readFileSync)(scriptFile, 'utf-8');
        this.outputDir = config.recorder.outputDir;
        this.initScript = JSON.parse(data);
        const defaultEncodingOptions = {
            size: { w: 1280, h: 720 },
            crf: 22
        };
        const encoding = {
            size: encOpt ? encOpt.size : defaultEncodingOptions.size,
            loglevel: encOpt === null || encOpt === void 0 ? void 0 : encOpt.loglevel
        };
        if (!(encOpt === null || encOpt === void 0 ? void 0 : encOpt.crf) && !(encOpt === null || encOpt === void 0 ? void 0 : encOpt.bitrate)) {
            encoding.crf = defaultEncodingOptions.crf;
        }
        else {
            encoding.crf = encOpt === null || encOpt === void 0 ? void 0 : encOpt.crf;
            encoding.bitrate = encOpt === null || encOpt === void 0 ? void 0 : encOpt.bitrate;
        }
        this.encodingOptions = encoding;
    }
    get startTime() {
        let firstVidTimestamp = Infinity, firstScreenTimestamp = Infinity, firstAudioTimestamp = Infinity;
        if (this.initScript.videos.length)
            firstVidTimestamp = this.getTimestamp(this.initScript.videos[0]);
        if (this.initScript.audios.length)
            firstAudioTimestamp = this.getTimestamp(this.initScript.audios[0]);
        if (this.initScript.screens.length)
            firstScreenTimestamp = this.getTimestamp(this.initScript.videos[0]);
        return Math.min(firstVidTimestamp, firstScreenTimestamp);
    }
    getTimestamp(filePath) {
        const filename = (0, path_1.basename)(filePath);
        return Number.parseInt(filename.split(".")[0]);
    }
    _initMedias(mediaPaths, params) {
        const medias = [];
        for (const mediaPath of mediaPaths) {
            const timestamp = this.getTimestamp(mediaPath);
            const startTime = timestamp - this.startTime;
            medias.push(new Media_1.default(mediaPath, startTime, Object.assign(Object.assign({}, params), { user: this.initScript.recorder })));
        }
        return medias;
    }
    async loadMedias() {
        const videos = this._initMedias(this.initScript.videos, { hasVideo: true });
        const audios = this._initMedias(this.initScript.audios, { hasAudio: true });
        const screens = this._initMedias(this.initScript.screens, { hasVideo: true, isScreen: true });
        await Promise.all([
            ...videos.map(m => m.init()),
            ...audios.map(m => m.init()),
            ...screens.map(m => m.init()),
        ]);
        const medias = [...videos, ...screens, ...audios];
        medias
            .sort((a, b) => a.startTime - b.startTime)
            .forEach((vid, index) => vid.setId(index));
        return medias;
    }
    initTimeline(medias) {
        const queue = [];
        medias.forEach(vid => {
            queue.push({
                start_point: true,
                time: vid.startTime,
                media_id: vid.id
            });
            queue.push({
                start_point: false,
                time: vid.startTime + vid.duration,
                media_id: vid.id
            });
        });
        queue.sort((a, b) => a.time - b.time);
        return queue;
    }
    createSteps(queue, medias) {
        const steps = [];
        const currentVideos = [];
        let prevTime = -1;
        while (queue.length > 0) {
            const point = queue.shift();
            if ((queue.length === 0 || point.time !== prevTime) && prevTime !== -1 && currentVideos.length >= 0) {
                const step = new Step_1.default(`Seq${steps.length}`, [...currentVideos], prevTime, point.time, this.encodingOptions.size, this.initScript.recorder.name);
                steps.push(step);
            }
            if (point === null || point === void 0 ? void 0 : point.start_point)
                currentVideos.push(medias[point.media_id]);
            else {
                const index = currentVideos.findIndex(vid => vid.id === (point === null || point === void 0 ? void 0 : point.media_id));
                currentVideos.splice(index, 1);
            }
            prevTime = point.time;
        }
        console.log('\n---- Videos ----');
        medias.forEach(vid => console.log('id', vid.id, 'start', vid.startTime, 'len', vid.duration, 'achan', vid.audioChannels, vid.path));
        console.log('\n---- Sequences ----');
        steps.forEach(step => {
            console.log(step.id, 'v:', '[' + step.mediaList.map(vid => vid.id.toString()).join(',') + ']', 'start', step.startTime, 'end', step.startTime + step.duration, 'len', step.duration);
        });
        console.log('after run initTimeline');
        return steps;
    }
    async generateCommand(steps, medias) {
        const command = [];
        console.log('============== steps=========', steps);
        const logging = this.encodingOptions.loglevel ? `-v ${this.encodingOptions.loglevel}` : `-v quiet -stats`;
        command.push(`ffmpeg ${logging} `);
        command.push(medias.map(video => `-i "${video.path}"`).join(' ') + ' ');
        command.push(`-filter_complex_script `);
        command.push('pipe:0 ');
        const quality = this.encodingOptions.crf ? `-crf ${this.encodingOptions.crf}` : `-b:v ${this.encodingOptions.bitrate}`;
        command.push(`-c:v libx264 ${quality} -preset fast -map [vid] -map [aud] -y "${this.outputDir}/${this.initScript.meeting_id}.mp4"`);
        const filter = [];
        filter.push(`${steps.map(step => step.generateFilter()).join('')}`);
        filter.push(`${steps.map(step => `[${step.id}_out_v][${step.id}_out_a]`).join('')}concat=n=${steps.length}:v=1:a=1[vid][aud]`);
        return Promise.all([filter.join(''), command.join('')]);
    }
    async encode() {
        try {
            const medias = await this.loadMedias();
            const timeline = this.initTimeline(medias);
            const steps = this.createSteps(timeline, medias);
            const [filter, command] = await this.generateCommand(steps, medias);
            return CommandExecutor_1.default.pipeExec(filter, command, true);
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.default = Composer;
//# sourceMappingURL=Composer.js.map