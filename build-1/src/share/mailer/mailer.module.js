"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MailerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerModule = void 0;
const path = require("path");
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("./mail.service");
let MailerModule = MailerModule_1 = class MailerModule {
    static forRoot() {
        return {
            global: true,
            module: MailerModule_1,
            imports: [
                mailer_1.MailerModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: async (config) => {
                        return {
                            transport: {
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true,
                                auth: {
                                    user: process.env.FROM_EMAIL,
                                    pass: process.env.EMAIL_APP_PASSWORD,
                                },
                            },
                            defaults: {
                                from: process.env.FROM_EMAIL,
                            },
                            template: {
                                dir: path.resolve(process.cwd(), 'src/share/mailer/email-templates'),
                                adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                            },
                            preview: config.get('isDev'),
                        };
                    },
                }),
            ],
            providers: [mail_service_1.MailService],
            exports: [mail_service_1.MailService],
        };
    }
};
MailerModule = MailerModule_1 = __decorate([
    (0, common_1.Module)({})
], MailerModule);
exports.MailerModule = MailerModule;
//# sourceMappingURL=mailer.module.js.map