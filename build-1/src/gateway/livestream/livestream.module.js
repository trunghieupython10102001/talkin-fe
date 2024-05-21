"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveStreamModule = void 0;
const common_1 = require("@nestjs/common");
const livestream_controller_1 = require("./livestream.controller");
const livestream_service_1 = require("./livestream.service");
const share_module_1 = require("../../share/share.module");
const wss_module_1 = require("../wss/wss.module");
let LiveStreamModule = class LiveStreamModule {
};
LiveStreamModule = __decorate([
    (0, common_1.Module)({
        imports: [share_module_1.ShareModule, wss_module_1.WssModule],
        controllers: [livestream_controller_1.LiveStreamRoomController],
        providers: [livestream_service_1.LivestreamRoomService],
        exports: [livestream_service_1.LivestreamRoomService],
    })
], LiveStreamModule);
exports.LiveStreamModule = LiveStreamModule;
//# sourceMappingURL=livestream.module.js.map