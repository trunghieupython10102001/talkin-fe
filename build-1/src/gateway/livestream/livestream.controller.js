"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveStreamRoomController = void 0;
const common_1 = require("@nestjs/common");
const livestream_service_1 = require("./livestream.service");
const swagger_1 = require("@nestjs/swagger");
const public_1 = require("../auth/decorator/public");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const getListLivestreamRoom_dto_1 = require("./dtos/getListLivestreamRoom.dto");
const updateLivestreamRoom_dto_1 = require("./dtos/updateLivestreamRoom.dto");
const createLivestreamRoom_dto_1 = require("./dtos/createLivestreamRoom.dto");
const cancelLivestreamRoom_dto_1 = require("./dtos/cancelLivestreamRoom.dto");
let LiveStreamRoomController = class LiveStreamRoomController {
    constructor(livestreamRoomService) {
        this.livestreamRoomService = livestreamRoomService;
    }
    getAll(req) {
        return this.livestreamRoomService.getAllLivestream(req);
    }
    getById(req, id) {
        return this.livestreamRoomService.getLiveStreamRoomById(req, id);
    }
    async createLivestreamRoom(thumbnail, req, createLiveStreamRoomDto) {
        const newLiveStream = await this.livestreamRoomService.createLiveStreamRoom(req.user.id, createLiveStreamRoomDto, thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.path);
        return newLiveStream;
    }
    async updateScheduleLivestream(thumbnail, req, liveStream) {
        return this.livestreamRoomService.updateScheduleLivestream(req, req.user.id, liveStream, thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.path);
    }
    async deleteScheduleLivestream(req, query) {
        return this.livestreamRoomService.deleteScheduleLiveStream(req, req.user.id, query);
    }
};
__decorate([
    (0, public_1.Public)(),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiQuery)({ type: getListLivestreamRoom_dto_1.ListLiveStreamRoomDto }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LiveStreamRoomController.prototype, "getAll", null);
__decorate([
    (0, public_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LiveStreamRoomController.prototype, "getById", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('thumbnail', {
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/live-thumbnail',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    (0, swagger_1.ApiBody)({
        type: createLivestreamRoom_dto_1.CreateLiveStreamRoomDto,
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.UploadedFile)('file')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, createLivestreamRoom_dto_1.CreateLiveStreamRoomDto]),
    __metadata("design:returntype", Promise)
], LiveStreamRoomController.prototype, "createLivestreamRoom", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('thumbnail', {
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/live-thumbnail',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    (0, swagger_1.ApiBody)({
        type: updateLivestreamRoom_dto_1.UpdateLivestreamRoomDTO,
    }),
    (0, common_1.Put)('/schedule'),
    __param(0, (0, common_1.UploadedFile)('file')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, updateLivestreamRoom_dto_1.UpdateLivestreamRoomDTO]),
    __metadata("design:returntype", Promise)
], LiveStreamRoomController.prototype, "updateScheduleLivestream", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('/schedule'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cancelLivestreamRoom_dto_1.CancelLivestreamRoomDto]),
    __metadata("design:returntype", Promise)
], LiveStreamRoomController.prototype, "deleteScheduleLivestream", null);
LiveStreamRoomController = __decorate([
    (0, swagger_1.ApiTags)('livestream'),
    (0, common_1.Controller)('livestream'),
    __metadata("design:paramtypes", [livestream_service_1.LivestreamRoomService])
], LiveStreamRoomController);
exports.LiveStreamRoomController = LiveStreamRoomController;
//# sourceMappingURL=livestream.controller.js.map