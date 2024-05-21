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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dtos/update-user.dto");
const errorcode_enum_1 = require("../../common/constants/errorcode.enum");
const update_user_wallet_1 = require("./dtos/update-user-wallet");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async uploadAvatar(file, req) {
        if (!file) {
            throw new common_1.BadRequestException(errorcode_enum_1.ErrorCode.INVALID_AVATAR);
        }
        if (file.size > 5000000) {
            throw new common_1.PayloadTooLargeException(errorcode_enum_1.ErrorCode.FILE_SIZE_TOO_LARGE);
        }
        await this.userService.update({}, req.user.id, { avatar: file.path });
        return { status: common_1.HttpStatus.OK };
    }
    async getProfile(req) {
        return this.userService.getProfile(req, req.user.id);
    }
    async updateProfile(req, updateUserDto) {
        const userId = req.user.id;
        return this.userService.updateProfile(userId, updateUserDto);
    }
    updateConnectedWallet(req, updateUserDto) {
        const userId = req.user.id;
        return this.userService.connectWalletToAccount(userId, updateUserDto);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
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
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['file'],
        },
    }),
    (0, common_1.Post)('upload-avatar'),
    __param(0, (0, common_1.UploadedFile)('file')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('/profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('/profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_user_wallet_1.UpdateUserWalletDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('/wallet'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_wallet_1.UpdateUserWalletDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateConnectedWallet", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map