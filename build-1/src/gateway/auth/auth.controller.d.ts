import { CreateUserDto } from 'src/gateway/user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignInWithWalletDTO } from './dtos/sign-in-wallet.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(userDto: CreateUserDto): Promise<{
        access_token: string;
    }>;
    signIn(input: SignInDTO): Promise<{
        access_token: string;
    }>;
    signInWithWallet(input: SignInWithWalletDTO): Promise<{
        access_token: string;
    }>;
}
