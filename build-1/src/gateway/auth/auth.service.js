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
exports.AuthService = void 0;
const errorcode_enum_1 = require("../../common/constants/errorcode.enum");
const utils_1 = require("../../common/utils/utils");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utils_2 = require("../../common/utils/utils");
const prisma_service_1 = require("../../share/prisma/prisma.service");
const ethers_1 = require("ethers");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prismaService, jwtService, config) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.config = config;
    }
    async signIn(input) {
        const { email, password } = input;
        const user = await this.prismaService.user.findFirst({ where: { email } });
        if (!user)
            throw new common_1.HttpException(`email or password is wrong`, common_1.HttpStatus.BAD_REQUEST);
        const isMatchedPassword = await (0, utils_2.comparePassword)(password, user.password);
        if (!isMatchedPassword)
            throw new common_1.HttpException(`email or password is wrong`, common_1.HttpStatus.BAD_REQUEST);
        const payload = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async signInWithWallet(authCredentials) {
        const signingWallet = ethers_1.ethers.verifyMessage(this.config.get('WALLET_SIGN_MESSAGE'), authCredentials.signMessage);
        const walletAddress = authCredentials.walletAddress;
        if (walletAddress.toLowerCase() !== signingWallet.toLowerCase()) {
            throw new common_1.BadRequestException('Invalid wallet address');
        }
        const user = await this.prismaService.user.findFirst({
            where: {
                wallet: walletAddress,
            },
        });
        if (!user) {
            throw new common_1.HttpException('user not exist', common_1.HttpStatus.NOT_FOUND);
        }
        const payload = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async signUp(userDto) {
        userDto.email = userDto.email.toLowerCase().trim();
        const user = await this.prismaService.user.findFirst({
            select: { id: true },
            where: { email: userDto.email },
        });
        if (user) {
            throw new common_1.BadRequestException({
                code: errorcode_enum_1.ErrorCode.EMAIL_EXISTED,
            });
        }
        userDto.password = await (0, utils_1.hashPasswordString)(userDto.password);
        const newUser = await this.prismaService.user.create({
            data: Object.assign(Object.assign({}, userDto), { fullname: userDto.firstname + ' ' + userDto.lastname }),
        });
        const payload = {
            id: newUser.id,
            email: newUser.email,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map