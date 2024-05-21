import { HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { BaseService } from 'src/common/base/base.service';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuardRequest } from '../auth/guards/auth.guard';
import { UpdateUserWalletDto } from 'src/gateway/user/dtos/update-user-wallet';
export declare class UserService extends BaseService {
    constructor(prisma: PrismaService, configService: ConfigService);
    updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<void>;
    getProfile(request: AuthGuardRequest, userId: number): Promise<any>;
    connectWalletToAccount(userId: number, walletInfo: UpdateUserWalletDto): Promise<{
        status: HttpStatus;
    }>;
}
