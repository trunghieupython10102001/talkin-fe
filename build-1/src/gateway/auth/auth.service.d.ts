import { CreateUserDto } from 'src/gateway/user/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dtos/sign-in.dto';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignInWithWalletDTO } from './dtos/sign-in-wallet.dto';
export declare class AuthService {
    private prismaService;
    private jwtService;
    private config;
    constructor(prismaService: PrismaService, jwtService: JwtService, config: ConfigService);
    signIn(input: SignInDTO): Promise<{
        access_token: string;
    }>;
    signInWithWallet(authCredentials: SignInWithWalletDTO): Promise<{
        access_token: string;
    }>;
    signUp(userDto: CreateUserDto): Promise<{
        access_token: string;
    }>;
}
