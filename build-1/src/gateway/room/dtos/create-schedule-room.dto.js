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
exports.CreateScheduleRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const isEmail_1 = require("validator/lib/isEmail");
const errorcode_enum_1 = require("../../../common/constants/errorcode.enum");
const meeting_room_enum_1 = require("../../../common/constants/meeting-room.enum");
class CreateScheduleRoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: errorcode_enum_1.ErrorCode.NAME_IS_NOT_EMPTY }),
    (0, class_validator_1.MaxLength)(255, {
        message: errorcode_enum_1.ErrorCode.NAME_IS_TOO_LONG,
    }),
    (0, class_validator_1.IsString)({ message: errorcode_enum_1.ErrorCode.NAME_IS_NOT_STRING }),
    __metadata("design:type", String)
], CreateScheduleRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: errorcode_enum_1.ErrorCode.DATE_STRING_INVALID }),
    (0, class_validator_1.IsDateString)(undefined, { message: errorcode_enum_1.ErrorCode.DATE_STRING_INVALID }),
    __metadata("design:type", String)
], CreateScheduleRoomDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: errorcode_enum_1.ErrorCode.DATE_STRING_INVALID }),
    (0, class_validator_1.IsDateString)(undefined, { message: errorcode_enum_1.ErrorCode.DATE_STRING_INVALID }),
    __metadata("design:type", String)
], CreateScheduleRoomDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(meeting_room_enum_1.MeetingRoomType, { message: errorcode_enum_1.ErrorCode.ROOM_TYPE_INVALID }),
    __metadata("design:type", String)
], CreateScheduleRoomDto.prototype, "type", void 0);
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
                        !(0, isEmail_1.default)(email, { domain_specific_validation: true }))
                        checkEmail = false;
                });
                return checkEmail;
            },
            defaultMessage: () => errorcode_enum_1.ErrorCode.EMAIL_INVALID,
        },
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateScheduleRoomDto.prototype, "invitedEmails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000, {
        message: errorcode_enum_1.ErrorCode.DESCRIPTION_IS_TOO_LONG,
    }),
    (0, class_validator_1.IsString)({ message: errorcode_enum_1.ErrorCode.DESCRIPTION_IS_NOT_STRING }),
    __metadata("design:type", String)
], CreateScheduleRoomDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: errorcode_enum_1.ErrorCode.HAS_SEND_MAIL_INVALID }),
    __metadata("design:type", Boolean)
], CreateScheduleRoomDto.prototype, "hasSendMail", void 0);
exports.CreateScheduleRoomDto = CreateScheduleRoomDto;
//# sourceMappingURL=create-schedule-room.dto.js.map