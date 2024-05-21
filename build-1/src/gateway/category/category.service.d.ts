import { PrismaService } from 'src/share/prisma/prisma.service';
import { BaseService } from 'src/common/base/base.service';
import { ConfigService } from '@nestjs/config';
export declare class CategoryService extends BaseService {
    constructor(prisma: PrismaService, configService: ConfigService);
}
