"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPort = exports.releasePort = exports.getPort = void 0;
const MIN_PORT = 20000;
const MAX_PORT = 30000;
const takenPortSet = new Set();
async function getPort() {
    let port = (0, exports.getRandomPort)();
    while (takenPortSet.has(port)) {
        port = (0, exports.getRandomPort)();
    }
    takenPortSet.add(port);
    return port;
}
exports.getPort = getPort;
function releasePort(port) {
    takenPortSet.delete(port);
}
exports.releasePort = releasePort;
const getRandomPort = () => Math.floor(Math.random() * (MAX_PORT - MIN_PORT + 1) + MIN_PORT);
exports.getRandomPort = getRandomPort;
//# sourceMappingURL=port.js.map