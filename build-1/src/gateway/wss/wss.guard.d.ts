import { JwtService } from '@nestjs/jwt';
import { IPeerInfo, IClientQuery } from './wss.interfaces';
import { PrismaService } from 'src/share/prisma/prisma.service';
export declare class WssGuard {
    private jwtService;
    private prismaService;
    constructor(jwtService: JwtService, prismaService: PrismaService);
    verifyClientQuery(clientQuery: IClientQuery): Promise<IPeerInfo>;
}
