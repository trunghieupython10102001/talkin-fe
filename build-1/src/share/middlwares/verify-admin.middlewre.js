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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAdminMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
let VerifyAdminMiddleware = class VerifyAdminMiddleware {
    constructor(configService) {
        this.configService = configService;
    }
    async use(req, res, next) {
        if (!req.headers.authorization)
            next();
        else {
            const token = req.headers.authorization.replace('Bearer', '').trim();
            const decodeToken = jwt.decode(token);
            if (!decodeToken)
                throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
            next();
        }
    }
};
VerifyAdminMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VerifyAdminMiddleware);
exports.VerifyAdminMiddleware = VerifyAdminMiddleware;
//# sourceMappingURL=verify-admin.middlewre.js.map