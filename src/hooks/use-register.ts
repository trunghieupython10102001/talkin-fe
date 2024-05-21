import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "./store";
import { authActions, authAsyncActions } from "@/store/authSlice";
import { ISnackbar } from "@/interfaces/type";

import { useNavigate } from "react-router-dom";
import { notify } from "@/store/thunks/notify";
import { CodeError } from "@/constants/codeError";
import { MESSAGE } from "@/constants/message";
import { ENOTIFY_TYPE } from "@/constants";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const registerFormik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().max(30, MESSAGE.MS_14).required(MESSAGE.MS_1).trim(),
      lastname: Yup.string().max(30, MESSAGE.MS_14).required(MESSAGE.MS_1).trim(),
      email: Yup.string().email().required(MESSAGE.MS_1).trim(),
      password: Yup.string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}(?:[@$!%*?&])?$/, MESSAGE.MS_13)
        .required(MESSAGE.MS_1)
        .trim(),
      confirmPassword: Yup.string()
        .required(MESSAGE.MS_1)
        .oneOf([Yup.ref("password")], MESSAGE.MS_15)
        .trim(),
    }),

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const paramsRegister = {
          password: values.password.trim(),
          firstname: values.firstname.trim(),
          lastname: values.lastname.trim(),
          email: values.email.trim(),
        };
        await dispatch(authAsyncActions.registerAction(paramsRegister)).unwrap();
        navigate("/register-success");
        dispatch(authActions.signUpSuccessAction());
      } catch (error: any) {
        const params: ISnackbar = {
          severity: "error",
          isOpen: true,
          message: "",
        };
        const code = error.response.data.code;
        switch (code) {
          case CodeError.BAD_REQUEST:
            params.message = MESSAGE.MS_8;
            break;
          case CodeError.EMAIL_INVALID:
            params.message = MESSAGE.MS_9;
            break;
          case CodeError.EMAIL_EXISTED:
            params.message = MESSAGE.MS_10;
            break;
          case CodeError.INVALID_USERNAME_FORMAT:
            params.message = MESSAGE.MS_11;
            break;
          case CodeError.INVALID_PASSWORD_FORMAT:
            params.message = MESSAGE.MS_12;
            break;
          default:
            break;
        }
        dispatch(notify({ text: params.message, type: ENOTIFY_TYPE.ERROR }));
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    registerFormik,
    isLoading,
  };
};
