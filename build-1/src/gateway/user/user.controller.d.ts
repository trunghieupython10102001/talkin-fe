/// <reference types="multer" />
import { HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuardRequest } from '../auth/guards/auth.guard';
import { UpdateUserWalletDto } from './dtos/update-user-wallet';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    uploadAvatar(file: Express.Multer.File, req: AuthGuardRequest): Promise<{
        status: HttpStatus;
    }>;
    getProfile(req: AuthGuardRequest): Promise<any>;
    updateProfile(req: AuthGuardRequest, updateUserDto: UpdateUserDto): Promise<void>;
    updateConnectedWallet(req: AuthGuardRequest, updateUserDto: UpdateUserWalletDto): Promise<{
        status: HttpStatus;
    }>;
}
