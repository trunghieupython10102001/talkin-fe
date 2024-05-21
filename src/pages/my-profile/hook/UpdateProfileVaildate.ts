import { MESSAGE } from "@/constants/message";
import { phoneRegExp, REGEX } from "@/constants/regex";
import * as Yup from "yup";

export const UpdateProfileValidate = Yup.object({
  firstname: Yup.string()
    .matches(REGEX.ONLY_NUMBER_CHARACTERS_SPACE, MESSAGE.MS_7)
    .max(30, MESSAGE.MS_14)
    .required(MESSAGE.MS_1)
    .trim(),
  lastname: Yup.string()
    .matches(REGEX.ONLY_NUMBER_CHARACTERS_SPACE, MESSAGE.MS_7)
    .max(30, MESSAGE.MS_14)
    .required(MESSAGE.MS_1)
    .trim(),
  email: Yup.string().email().max(254, MESSAGE.MS_21).required(MESSAGE.MS_1),
  phone: Yup.string().matches(phoneRegExp, MESSAGE.MS_20).max(30, MESSAGE.MS_14),
  address: Yup.string().max(200, MESSAGE.MS_18),
  description: Yup.string().max(1000, MESSAGE.MS_19),
  birthday: Yup.date()
    .min(new Date("1900-01-01T00:00:00.000"), MESSAGE.MS_22)
    .max(new Date(), MESSAGE.MS_22)
    .typeError(MESSAGE.MS_22),
});
