"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Presenter_1 = require("./layouts/Presenter");
class Step {
    constructor(id, mediaList, startTime, endTime, size, displayName) {
        this.id = id;
        this.mediaList = mediaList;
        this.startTime = startTime;
        this.duration = endTime - startTime;
        this.size = size;
        this.layout = new Presenter_1.default();
        this.displayName = displayName ? displayName.substring(0, 12) : id;
    }
    generateFilter() {
        const videoList = this.mediaList.filter(media => media.hasVideo);
        const screenIdx = videoList.findIndex(media => media.isScreen);
        if (screenIdx >= 0) {
            const mediaScreen = videoList[screenIdx];
            videoList.splice(screenIdx, 1);
            videoList.unshift(mediaScreen);
        }
        const out = [];
        out.push(`color=s=${this.size.w}x${this.size.h},trim=0:${this.duration / 1000}[${this.id}_bg];`);
        if (screenIdx >= 0) {
            const vid = videoList[0];
            const screenBox = this.layout.getScreenBox(this.size);
            const box = this.layout.getCamBox(this.size);
            out.push(`[${vid.id}:v]trim=${(this.startTime - vid.startTime) / 1000}:${(this.duration + this.startTime - vid.startTime) / 1000},setpts=PTS-STARTPTS,`);
            out.push(`scale=w='if(gt(iw/ih,${screenBox.w}/(${screenBox.h})),${screenBox.w},-2)':h='if(gt(iw/ih,${screenBox.w}/(${screenBox.h})),-2,${screenBox.h})':eval=init[${this.id}_0_v];`);
            if (videoList.length > 1) {
                const camVid = videoList[1];
                out.push(`[${camVid.id}:v]trim=${(this.startTime - camVid.startTime) / 1000}:${(this.duration + this.startTime - camVid.startTime) / 1000},setpts=PTS-STARTPTS,`);
                out.push(`scale=w='if(gt(iw/ih,${box.w}/(${box.h})),${box.w},-2)':h='if(gt(iw/ih,${box.w}/(${box.h})),-2,${box.h})':eval=init[${this.id}_1_v];`);
            }
            else {
                out.push(`color=s=${this.size.w}x${this.size.h}:c=#262626@1.0,trim=0:${this.duration / 1000},drawtext=text='${this.displayName}':x=(w-tw)/2:y=((h-th)/2):fontcolor=white:fontsize=55,`);
                out.push(`scale=w='if(gt(iw/ih,${box.w}/(${box.h})),${box.w},-2)':h='if(gt(iw/ih,${box.w}/(${box.h})),-2,${box.h})':eval=init[${this.id}_1_v];`);
            }
            out.push(`[${this.id}_bg][${this.id}_0_v]overlay=x='(${screenBox.w}-w)/2+${screenBox.x}':y='(${screenBox.h}-h)/2+${screenBox.y}':eval=init:shortest=1[${this.id}_overlay_1];`);
            out.push(`[${this.id}_overlay_1][${this.id}_1_v]overlay=x='(${box.w}-w)/2+${box.x}':y='(${box.h}-h)/2+${box.y}':eval=init:shortest=1[${this.id}_out_v];`);
        }
        else if (videoList.length === 1) {
            const vid = videoList[0];
            const box = { w: this.size.w, h: this.size.h, x: 0, y: 0 };
            out.push(`[${vid.id}:v]trim=${(this.startTime - vid.startTime) / 1000}:${(this.duration + this.startTime - vid.startTime) / 1000},setpts=PTS-STARTPTS,`);
            out.push(`scale=w='if(gt(iw/ih,${box.w}/(${box.h})),${box.w},-2)':h='if(gt(iw/ih,${box.w}/(${box.h})),-2,${box.h})':eval=init[${this.id}_0_v];`);
            out.push(`[${this.id}_bg][${this.id}_0_v]overlay=x='(${box.w}-w)/2+${box.x}':y='(${box.h}-h)/2+${box.y}':eval=init:shortest=1[${this.id}_out_v];`);
        }
        else if (videoList.length === 0) {
            const box = { w: this.size.w, h: this.size.h, x: 0, y: 0 };
            out.push(`color=s=${this.size.w}x${this.size.h}:c=#262626@1.0,trim=0:${this.duration / 1000},drawtext=text='${this.displayName}':x=(w-tw)/2:y=((h-th)/2):fontcolor=white:fontsize=55,`);
            out.push(`scale=w='if(gt(iw/ih,${box.w}/(${box.h})),${box.w},-2)':h='if(gt(iw/ih,${box.w}/(${box.h})),-2,${box.h})':eval=init[${this.id}_0_v];`);
            out.push(`[${this.id}_bg][${this.id}_0_v]overlay=x='(${box.w}-w)/2+${box.x}':y='(${box.h}-h)/2+${box.y}':eval=init:shortest=1[${this.id}_out_v];`);
        }
        const audioList = this.mediaList.filter(media => media.hasAudio);
        audioList.forEach(vid => {
            out.push(`[${vid.id}:a]atrim=${(this.startTime - vid.startTime) / 1000}:${(this.duration + this.startTime - vid.startTime) / 1000},asetpts=PTS-STARTPTS[${this.id}_${vid.id}_a];`);
        });
        const inputList = audioList.map(vid => `[${this.id}_${vid.id}_a]`).join('');
        let c0 = '';
        let c1 = '';
        let currentIndex = 0;
        audioList.forEach((vid, ind) => {
            const plus = ind === audioList.length - 1 ? '' : '+';
            if (vid.audioChannels === 6) {
                c0 += `0.4*c${currentIndex}+0.6*c${currentIndex + 2}${plus}`;
                c1 += `0.4*c${currentIndex + 1}+0.6*c${currentIndex + 2}${plus}`;
            }
            else {
                c0 += `c${currentIndex}${plus}`;
                c1 += `c${currentIndex + 1}${plus}`;
            }
            currentIndex += vid.audioChannels;
        });
        if (audioList.length > 0) {
            out.push(`${inputList}amerge=inputs=${audioList.length},pan='stereo|c0<${c0}|c1<${c1}'[${this.id}_out_a];`);
        }
        else {
            out.push(`anullsrc=r=48000:cl=stereo,atrim=0:${this.duration / 1000},asetpts=PTS-STARTPTS[${this.id}_out_a];`);
        }
        return out.join('');
    }
}
exports.default = Step;
//# sourceMappingURL=Step.js.map