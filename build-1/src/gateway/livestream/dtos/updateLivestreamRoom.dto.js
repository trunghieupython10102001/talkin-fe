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
exports.UpdateLivestreamRoomDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const errorcode_enum_1 = require("../../../common/constants/errorcode.enum");
var UpdateLivestreamRoomStatus;
(function (UpdateLivestreamRoomStatus) {
    UpdateLivestreamRoomStatus["LIVE"] = "live";
    UpdateLivestreamRoomStatus["COMING_SOON"] = "coming_soon";
    UpdateLivestreamRoomStatus["END"] = "end";
})(UpdateLivestreamRoomStatus || (UpdateLivestreamRoomStatus = {}));
class UpdateLivestreamRoomDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: errorcode_enum_1.ErrorCode.ID_IS_NOT_EMPTY }),
    (0, class_validator_1.IsString)({ message: errorcode_enum_1.ErrorCode.ID_IS_NOT_STRING }),
    __metadata("design:type", String)
], UpdateLivestreamRoomDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, {
        message: errorcode_enum_1.ErrorCode.NAME_IS_TOO_LONG,
    }),
    (0, class_validator_1.IsString)({
        message: errorcode_enum_1.ErrorCode.NAME_IS_NOT_STRING,
    }),
    __metadata("design:type", String)
], UpdateLivestreamRoomDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(undefined, { message: errorcode_enum_1.ErrorCode.DATE_STRING_INVALID }),
    __metadata("design:type", Date)
], UpdateLivestreamRoomDTO.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000, {
        message: errorcode_enum_1.ErrorCode.DESCRIPTION_IS_TOO_LONG,
    }),
    __metadata("design:type", String)
], UpdateLivestreamRoomDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateBy)({
        name: 'invitedEmails',
        validator: {
            validate: (value, args) => {
                const invitedEmails = args.object.invitedEmails;
                let checkEmail = true;
                invitedEmails.forEach((email) => {
                    if (typeof email !== 'string' ||
                        !(0, class_validator_1.isEmail)(email, { domain_specific_validation: true }))
                        checkEmail = false;
                });
                return checkEmail;
            },
            defaultMessage: () => errorcode_enum_1.ErrorCode.EMAIL_INVALID,
        },
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateLivestreamRoomDTO.prototype, "invitedEmails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayMaxSize)(3),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateLivestreamRoomDTO.prototype, "listCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        format: 'binary',
        type: 'string',
    }),
    __metadata("design:type", Object)
], UpdateLivestreamRoomDTO.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: errorcode_enum_1.ErrorCode.HAS_SEND_MAIL_INVALID }),
    __metadata("design:type", String)
], UpdateLivestreamRoomDTO.prototype, "hasSendMail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UpdateLivestreamRoomStatus),
    __metadata("design:type", String)
], UpdateLivestreamRoomDTO.prototype, "status", void 0);
exports.UpdateLivestreamRoomDTO = UpdateLivestreamRoomDTO;
//# sourceMappingURL=updateLivestreamRoom.dto.js.map