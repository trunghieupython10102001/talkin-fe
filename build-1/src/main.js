"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const express = require("express");
const fs_1 = require("fs");
const path_1 = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const server = express();
    const httpsOptions = {
        key: undefined,
        cert: undefined,
    };
    let hasHttps = true;
    try {
        httpsOptions.key = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../certs/privkey.pem'));
        httpsOptions.cert = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../certs/fullchain.pem'));
    }
    catch (e) {
        hasHttps = false;
    }
    const app = hasHttps
        ? await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), {
            httpsOptions,
            cors: true,
        })
        : await core_1.NestFactory.create(app_module_1.AppModule);
    app.use('/api/v1/uploads', express.static('uploads'));
    app.use('/api/v1/records', express.static('records'));
    app.setGlobalPrefix('api/v1');
    if (process.env.NODE_ENV === 'development') {
        const configBuilder = new swagger_1.DocumentBuilder()
            .setTitle('API documentation')
            .setDescription('Talkin')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, configBuilder);
        swagger_1.SwaggerModule.setup('api-docs', app, document);
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        });
    }
    app.useGlobalPipes(new common_1.ValidationPipe());
    const PORT = parseInt(process.env.PORT || '3000', 10);
    console.log('listen at port: ', PORT);
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map