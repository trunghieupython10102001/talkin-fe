"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PresenterLayout {
    getBoxes(n, size) {
        if (n === 1) {
            return [{
                    w: size.w,
                    h: size.h,
                    x: 0,
                    y: 0
                }];
        }
        const out = [];
        out.push({
            w: size.w * 3 / 4,
            h: size.h,
            x: 0,
            y: 0
        });
        const side = n - 1 <= 4 ? 2 : Math.ceil(Math.sqrt(n - 1));
        for (let y = 0; y < side; y++) {
            for (let x = 0; x < side; x++) {
                out.push({
                    w: size.w / 4,
                    h: size.h / side / 2,
                    x: size.w * 3 / 4,
                    y: size.h / 2 - size.h / 8
                });
            }
        }
        return out;
    }
    getBoxesLayout(videos, size) {
        if (videos.length === 0)
            return [];
        const boxes = [];
        if (videos[0].isScreen) {
            boxes[0] = this.getScreenBox(size);
            for (let i = 1; i < videos.length; i++)
                boxes.push(this.getCamBox(size));
        }
        else {
            boxes.push({
                w: size.w,
                h: size.h,
                x: 0,
                y: 0
            });
        }
        return boxes;
    }
    getScreenBox(size) {
        return {
            w: size.w * 3 / 4,
            h: size.h,
            x: 0,
            y: 0
        };
    }
    getCamBox(size) {
        return {
            w: size.w / 4,
            h: size.h / 4,
            x: size.w * 3 / 4,
            y: size.h / 2 - size.h / 8
        };
    }
}
exports.default = PresenterLayout;
//# sourceMappingURL=Presenter.js.map