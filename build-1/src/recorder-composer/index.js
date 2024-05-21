"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = void 0;
const Composer_1 = require("./Composer");
const encodingOptions = {
    crf: 20,
    loglevel: 'verbose',
    size: {
        w: 1280,
        h: 720
    }
};
function compose(scriptLink) {
    const c = new Composer_1.default(scriptLink, encodingOptions);
    return c.encode();
}
exports.compose = compose;
//# sourceMappingURL=index.js.map