import { MESSAGE } from "@/constants/message";
import { IFormSchedule } from "@/interfaces/type";
import * as Yup from "yup";
import { isEmail } from "react-multi-email";
import moment from "moment";

const prevDay = moment().subtract(1, "day").toDate();
const pastTime = moment().toDate();

export const CreateScheduleValidation = Yup.object<IFormSchedule>({
  name: Yup.string().max(255, MESSAGE.MS_28).required(MESSAGE.MS_1).trim(),
  date: Yup.date()
    .min(prevDay, MESSAGE.MS_29)
    .max(new Date("2099-12-31T00:00:00.000Z"), MESSAGE.MS_29)
    .typeError(MESSAGE.MS_29)
    .required(MESSAGE.MS_1),
  type: Yup.string().max(30, MESSAGE.MS_14).required(MESSAGE.MS_1),
  startTime: Yup.date().required(MESSAGE.MS_1).typeError(MESSAGE.MS_29).min(pastTime, MESSAGE.MS_31),
  endTime: Yup.date()
    .required(MESSAGE.MS_1)
    .min(pastTime, MESSAGE.MS_31)
    .when("startTime", ([startTime], schema) => {
      if (startTime && pastTime.getTime() > startTime.getTime()) {
        return schema.min(pastTime, MESSAGE.MS_31);
      }

      return startTime ? schema.min(startTime, MESSAGE.MS_30) : schema.required(MESSAGE.MS_1);
    })
    .typeError(MESSAGE.MS_30),
  description: Yup.string().max(1000, MESSAGE.MS_19),
  invitedEmails: Yup.array().min(1, MESSAGE.MS_1),
  tempEmail: Yup.string().test("tempEmail", MESSAGE.MS_16, (value) => (value ? isEmail(value) : true)),
});
