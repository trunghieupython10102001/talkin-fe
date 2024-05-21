"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const logger_module_1 = require("./logger/logger.module");
const prisma_service_1 = require("./prisma/prisma.service");
const verify_admin_middlewre_1 = require("./middlwares/verify-admin.middlewre");
const config_1 = require("@nestjs/config");
const mailer_module_1 = require("./mailer/mailer.module");
const mail_service_1 = require("./mailer/mail.service");
let ShareModule = class ShareModule {
};
ShareModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, logger_module_1.LoggerModule, mailer_module_1.MailerModule.forRoot()],
        controllers: [],
        providers: [prisma_service_1.PrismaService, verify_admin_middlewre_1.VerifyAdminMiddleware, config_1.ConfigService, mail_service_1.MailService],
        exports: [prisma_service_1.PrismaService, verify_admin_middlewre_1.VerifyAdminMiddleware, config_1.ConfigService, mail_service_1.MailService],
    })
], ShareModule);
exports.ShareModule = ShareModule;
//# sourceMappingURL=share.module.js.map