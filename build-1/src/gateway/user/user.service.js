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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../share/prisma/prisma.service");
const base_service_1 = require("../../common/base/base.service");
const config_1 = require("@nestjs/config");
const ethers_1 = require("ethers");
let UserService = class UserService extends base_service_1.BaseService {
    constructor(prisma, configService) {
        super(prisma, 'user', 'User', configService);
    }
    async updateProfile(userId, updateUserDto) {
        const updateUser = {
            email: updateUserDto.email,
            firstname: updateUserDto.firstname,
            lastname: updateUserDto.lastname,
            birthday: updateUserDto.birthday || null,
            gender: updateUserDto.gender || null,
            phone: updateUserDto.phone || null,
            address: updateUserDto.address || null,
            description: updateUserDto.description || null,
        };
        await this.update({}, userId, Object.assign(Object.assign({}, updateUser), { fullname: updateUserDto.firstname + ' ' + updateUserDto.lastname }));
    }
    async getProfile(request, userId) {
        const user = await this.get(request, userId);
        delete user.password;
        return user;
    }
    async connectWalletToAccount(userId, walletInfo) {
        const isWalletAddress = ethers_1.ethers.isAddress(walletInfo.address);
        if (!isWalletAddress) {
            throw new common_1.BadRequestException({
                message: 'Invalid wallet address',
            });
        }
        const user = await this.prismaService.user.findFirst({
            where: {
                wallet: walletInfo.address,
                NOT: {
                    id: userId,
                },
            },
        });
        if (user) {
            throw new common_1.BadRequestException({
                message: 'Wallet has been connected',
            });
        }
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                wallet: walletInfo.address,
            },
        });
        return {
            status: common_1.HttpStatus.OK,
        };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map