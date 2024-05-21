"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LivestreamRoom_1 = require("./LivestreamRoom");
const MeetingRoom_1 = require("./MeetingRoom");
class RoomFactory {
    createMeetingRoom(params) {
        return new MeetingRoom_1.default(params.worker, params.workerIndex, params.id, params.wssServer, params.prismaService, params.mailService);
    }
    createLivestreamRoom(params) {
        return new LivestreamRoom_1.default(params.worker, params.workerIndex, params.id, params.wssServer, params.prismaService, params.mailService);
    }
}
exports.default = RoomFactory;
//# sourceMappingURL=RoomFactory.js.map