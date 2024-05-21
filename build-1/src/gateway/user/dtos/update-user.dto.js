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
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const errorcode_enum_1 = require("../../../common/constants/errorcode.enum");
const IsEmailAddress_1 = require("../../../common/utils/IsEmailAddress");
const swagger_1 = require("@nestjs/swagger");
const gender_enum_1 = require("../../../common/constants/gender.enum");
class UpdateUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, IsEmailAddress_1.IsEmailAddress)(),
    (0, class_validator_1.IsNotEmpty)({
        message: errorcode_enum_1.ErrorCode.EMAIL_IS_NOT_EMPTY,
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
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
], UpdateUserDto.prototype, "firstname", void 0);
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
], UpdateUserDto.prototype, "lastname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(undefined, { message: errorcode_enum_1.ErrorCode.DATE_STRING_INVALID }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender, {
        message: errorcode_enum_1.ErrorCode.GENDER_INVALID,
    }),
    (0, class_transformer_1.Expose)({ name: 'gender' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d*)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?)+)(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i, {
        message: errorcode_enum_1.ErrorCode.INVALID_PHONE_NUMBER_FORMAT,
    }),
    (0, class_transformer_1.Expose)({ name: 'phone' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({
        message: errorcode_enum_1.ErrorCode.ADDRESS_IS_NOT_STRING,
    }),
    (0, class_validator_1.MaxLength)(200, {
        message: errorcode_enum_1.ErrorCode.ADDRESS_IS_TOO_LONG,
    }),
    (0, class_transformer_1.Expose)({ name: 'address' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "address", void 0);
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
], UpdateUserDto.prototype, "description", void 0);
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map