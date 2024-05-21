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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const errorcode_enum_1 = require("../../../common/constants/errorcode.enum");
const IsEmailAddress_1 = require("../../../common/utils/IsEmailAddress");
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, IsEmailAddress_1.IsEmailAddress)(),
    (0, class_validator_1.IsNotEmpty)({
        message: errorcode_enum_1.ErrorCode.EMAIL_IS_NOT_EMPTY,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)({
        message: errorcode_enum_1.ErrorCode.NAME_IS_NOT_STRING,
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: errorcode_enum_1.ErrorCode.NAME_IS_NOT_EMPTY,
    }),
    (0, class_validator_1.MaxLength)(30, {
        message: errorcode_enum_1.ErrorCode.NAME_IS_TOO_LONG,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)({
        message: errorcode_enum_1.ErrorCode.NAME_IS_NOT_STRING,
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: errorcode_enum_1.ErrorCode.NAME_IS_NOT_EMPTY,
    }),
    (0, class_validator_1.MaxLength)(30, {
        message: errorcode_enum_1.ErrorCode.NAME_IS_TOO_LONG,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)({
        message: errorcode_enum_1.ErrorCode.PASSWORD_IS_NOT_STRING,
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: errorcode_enum_1.ErrorCode.PASSWORD_IS_NOT_EMPTY,
    }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}(?:[@$!%*?&])?$/, {
        message: errorcode_enum_1.ErrorCode.INVALID_PASSWORD_FORMAT,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({
        message: errorcode_enum_1.ErrorCode.AVATAR_IS_NOT_STRING,
    }),
    (0, class_transformer_1.Expose)({ name: 'avatar' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000, {
        message: errorcode_enum_1.ErrorCode.DESCRIPTION_IS_TOO_LONG,
    }),
    (0, class_validator_1.IsString)({
        message: errorcode_enum_1.ErrorCode.DESCRIPTION_IS_NOT_STRING,
    }),
    (0, class_transformer_1.Expose)({ name: 'description' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "description", void 0);
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map