import { useContext } from "react";
import { useFormik } from "formik";
import RoomContext from "@/context/RoomContext";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/hooks";
import moment from "moment";
import { roomActions } from "@/store/roomSlice";
import { IMessage } from "@/interfaces/type";

interface IChatForm {
  enteredMessage: "";
}

export default function useChatInputViewController() {
  const roomClient = useContext(RoomContext);
  const me = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const formController = useFormik<IChatForm>({
    initialValues: {
      enteredMessage: "",
    },
    validationSchema: Yup.object({
      enteredMessage: Yup.string().max(2000).required(),
    }),
    onSubmit: async (values: IChatForm, { resetForm }) => {
      await roomClient?.sendChatMessage(values.enteredMessage);
      const message: IMessage = {
        displayName: me.displayName || '',
        content: values.enteredMessage,
        sentAt: moment().format("hh:mm A"),
      }
      dispatch(roomActions.addMessage(message));
      resetForm();
    },
  });

  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();
    formController.handleSubmit();
  };

  return {
    formController,
    sendMessageHandler,
  };
}
