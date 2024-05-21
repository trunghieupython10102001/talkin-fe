"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEmailAddress = void 0;
const class_validator_1 = require("class-validator");
const isEmail_1 = require("validator/lib/isEmail");
const errorcode_enum_1 = require("../constants/errorcode.enum");
function IsEmailAddress(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value) {
                    return (typeof value === 'string' &&
                        (0, isEmail_1.default)(value, { domain_specific_validation: true }));
                },
                defaultMessage() {
                    return errorcode_enum_1.ErrorCode.EMAIL_INVALID;
                },
            },
        });
    };
}
exports.IsEmailAddress = IsEmailAddress;
//# sourceMappingURL=IsEmailAddress.js.map