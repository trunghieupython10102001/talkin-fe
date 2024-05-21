"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
class BaseService {
    constructor(prismaService, entityModel, modelName, configService) {
        this.prismaService = prismaService;
        this.entityModel = entityModel;
        this.configService = configService;
        const tempFields = client_1.Prisma.dmmf.datamodel.models.find((model) => model.name == modelName)
            .fields || [];
        this.fields = new Map();
        for (const field of tempFields) {
            this.fields[field.name] = field;
        }
    }
    async getAll(req, other = {}) {
        const params = this.exportParams(req);
        console.log('data: ', JSON.stringify(params));
        const { query, select, skip, take, sorts } = params;
        const allFields = this.getAllFields();
        const data = await this.prismaService[this.entityModel].findMany(Object.assign({ where: query, select: Object.keys(select).length !== 0 ? select : allFields, orderBy: sorts, skip,
            take }, other));
        const meta = await this.buildMetaData(take, query);
        return { meta, data };
    }
    async getAllByQuery(query = {}) {
        const data = await this.prismaService[this.entityModel].findMany({
            where: query,
        });
        return data;
    }
    async updateByQuery(query, data) {
        await this.prismaService[this.entityModel].updateMany({
            where: query,
            data,
        });
        return true;
    }
    async create(data, other = {}) {
        console.log(data);
        try {
            return await this.prismaService[this.entityModel].create(Object.assign({ data }, other));
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async get(req, id, other = {}) {
        const allFields = this.getAllFields();
        const rs = await this.prismaService[this.entityModel].findFirst(Object.assign({ where: Object.assign(Object.assign({}, req.query), { id: id }), select: allFields }, other));
        if (rs)
            return rs;
        throw new common_1.HttpException('Cannot find', common_1.HttpStatus.NOT_FOUND);
    }
    async update(query = {}, id, data, other = {}) {
        console.log('query: ', query);
        const rs = await this.prismaService[this.entityModel].updateMany(Object.assign({ where: Object.assign(Object.assign({}, query), { id: id }), data }, other));
        if (rs.count)
            return await this.prismaService[this.entityModel].findFirst(Object.assign({ where: { id: id } }, other));
        throw new common_1.HttpException('Cannot update', common_1.HttpStatus.NOT_FOUND);
    }
    async remove(req, id, other = {}) {
        return await this.prismaService[this.entityModel].deleteMany(Object.assign({ where: Object.assign(Object.assign({}, req.query), { id: id }) }, other));
    }
    async buildMetaData(size, query) {
        const count = await this.prismaService[this.entityModel].count({
            where: query,
        });
        return {
            count,
            totalPages: size > 0 ? Math.ceil(count / size) : 1,
        };
    }
    async upsert(query = {}, create, update = {}, other = {}) {
        try {
            return await this.prismaService[this.entityModel].upsert(Object.assign({ where: query, update: update, create: create }, other));
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    exportParams(req) {
        const params = req.query;
        let page = 0;
        let size = this.configService.get('PERPAGE_DEFAULT', 20);
        let sorts = { id: 'desc' };
        const select = {};
        if (params['fields']) {
            const fields = params['fields'];
            for (const field of fields.split(',')) {
                select[field] = field;
            }
            delete params['fields'];
        }
        if ((params.page == '0' || params.page) && !isNaN(+(params === null || params === void 0 ? void 0 : params.page))) {
            page = Math.max(0, +params.page);
            delete params['page'];
        }
        if (params.size && !isNaN(+(params === null || params === void 0 ? void 0 : params.size))) {
            size = +params.size;
            delete params['size'];
        }
        if (params['sort_by']) {
            sorts = {};
            let key = params.sort_by;
            const orderBy = ((params === null || params === void 0 ? void 0 : params.order_by) || '');
            if (!this.fields[key]) {
                key = 'id';
            }
            sorts[key] = orderBy.toLowerCase() == 'desc' ? 'desc' : 'asc';
            delete params['sort_by'];
            delete params['order_by'];
        }
        const query = {};
        const arrayFieldLike = [];
        for (const key in params) {
            if (!params[key] && params[key] != '0') {
                continue;
            }
            if (this.fields[key]) {
                if (['Int', 'BigInt', 'Float', 'Decimal'].includes(this.fields[key].type)) {
                    query[key] = +params[key];
                }
                else {
                    query[key] = params[key];
                }
                continue;
            }
            if (key.endsWith('_gte') && !isNaN(+params[key])) {
                const attr = key.replace('_gte', '');
                if (!this.fields[attr]) {
                    continue;
                }
                if (this.fields[attr].type == 'String') {
                    continue;
                }
                const type = typeof query[attr];
                if ((query[attr] || query[attr] == '0') && type != 'object') {
                    continue;
                }
                query[attr] = Object.assign(Object.assign({}, query[attr]), { gte: +params[key] });
                continue;
            }
            if (key.endsWith('_lte') && !isNaN(+params[key])) {
                const attr = key.replace('_lte', '');
                if (!this.fields[attr]) {
                    continue;
                }
                if (this.fields[attr].type == 'String') {
                    continue;
                }
                const type = typeof query[attr];
                if ((query[attr] || query[attr] == 0) && type != 'object') {
                    continue;
                }
                query[attr] = Object.assign(Object.assign({}, query[attr]), { lte: +params[key] });
                continue;
            }
            if (key.endsWith('_gt') && !isNaN(+params[key])) {
                const attr = key.replace('_gt', '');
                if (!this.fields[attr]) {
                    continue;
                }
                if (this.fields[attr].type == 'String') {
                    continue;
                }
                const type = typeof query[attr];
                if ((query[attr] || query[attr] == 0) && type != 'object') {
                    continue;
                }
                query[attr] = Object.assign(Object.assign({}, query[attr]), { gt: +params[key] });
                continue;
            }
            if (key.endsWith('_lt') && !isNaN(+params[key])) {
                const attr = key.replace('_lt', '');
                if (!this.fields[attr]) {
                    continue;
                }
                if (this.fields[attr].type == 'String') {
                    continue;
                }
                const type = typeof query[attr];
                if ((query[attr] || query[attr] == 0) && type != 'object') {
                    continue;
                }
                query[attr] = Object.assign(Object.assign({}, query[attr]), { lt: +params[key] });
                continue;
            }
            if (key.endsWith('_in')) {
                const attr = key.replace('_in', '');
                if (!this.fields[attr]) {
                    continue;
                }
                const type = typeof query[attr];
                if ((query[attr] || query[attr] == 0) && type != 'object') {
                    continue;
                }
                let values = (params[key] || '')
                    .split(',')
                    .filter((item) => item.trim().length > 0);
                if (['Int', 'BigInt', 'Float', 'Decimal'].includes(this.fields[attr].type)) {
                    values = values.map((item) => +item.trim());
                }
                else {
                    values = values.map((item) => item.trim());
                }
                query[attr] = { in: values };
                continue;
            }
            if (key.endsWith('_notin')) {
                console.log();
                const attr = key.replace('_notin', '');
                if (!this.fields[attr]) {
                    continue;
                }
                const type = typeof query[attr];
                if ((query[attr] || query[attr] == 0) && type != 'object') {
                    continue;
                }
                let values = (params[key] || '')
                    .split(',')
                    .filter((item) => item.trim().length > 0);
                if (['Int', 'BigInt', 'Float', 'Decimal'].includes(this.fields[attr].type)) {
                    values = values.map((item) => +item.trim());
                }
                else {
                    values = values.map((item) => item.trim());
                }
                query[attr] = { not: { in: values } };
                continue;
            }
            if (key.endsWith('_like')) {
                const attr = key.replace('_like', '');
                if (attr.includes('.')) {
                    const [entity, childKey] = attr.split('.');
                    if (!this.fields[entity]) {
                        continue;
                    }
                    arrayFieldLike.push({
                        [entity]: {
                            [childKey]: { contains: params[key], mode: 'insensitive' },
                        },
                    });
                    continue;
                }
                if (!this.fields[attr]) {
                    continue;
                }
                const type = typeof query[attr];
                if (query[attr] && type != 'object') {
                    continue;
                }
                arrayFieldLike.push({
                    [attr]: { contains: params[key], mode: 'insensitive' },
                });
                continue;
            }
            if (key.endsWith('_has')) {
                const attr = key.replace('_has', '');
                if (!this.fields[attr]) {
                    continue;
                }
                const type = typeof query[attr];
                if ((query[attr] || query[attr] == 0) && type != 'object') {
                    continue;
                }
                query[attr] = { hasEvery: params[key] };
            }
        }
        if (arrayFieldLike.length)
            query['OR'] = arrayFieldLike;
        const skip = Math.max(Math.max(page - 1, 0) * size, 0);
        return { query, select, skip, take: size > 0 ? size : undefined, sorts };
    }
    getAllFields() {
        const allFields = {};
        for (const key of Object.keys(this.fields)) {
            allFields[key] = true;
        }
        return allFields;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map