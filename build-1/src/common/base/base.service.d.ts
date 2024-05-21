import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/share/prisma/prisma.service';
export declare class BaseService {
    protected prismaService: PrismaService;
    protected entityModel: string;
    protected fields: Map<string, Prisma.DMMF.Field>;
    protected configService: ConfigService;
    constructor(prismaService: PrismaService, entityModel: string, modelName: string, configService: ConfigService);
    getAll(req: Request, other?: any): Promise<any>;
    getAllByQuery(query?: any): Promise<any>;
    updateByQuery(query: any, data: any): Promise<any>;
    create(data: any, other?: any): Promise<any>;
    get(req: Request, id: any, other?: any): Promise<any>;
    update(query: any, id: any, data: any, other?: any): Promise<any>;
    remove(req: Request, id: any, other?: any): Promise<any>;
    buildMetaData(size: number, query: any): Promise<any>;
    upsert(query: any, create: any, update?: any, other?: any): Promise<any>;
    exportParams(req: Request): any;
    getAllFields(): {};
}
