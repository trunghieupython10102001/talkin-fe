"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = exports.cloneObject = void 0;
function cloneObject(data, defaultValue = {}) {
    if (typeof data === 'undefined')
        return defaultValue;
    return JSON.parse(JSON.stringify(data));
}
exports.cloneObject = cloneObject;
function exclude(obj, keys) {
    for (const key of keys) {
        delete obj[key];
    }
    return obj;
}
exports.exclude = exclude;
//# sourceMappingURL=lib.js.map