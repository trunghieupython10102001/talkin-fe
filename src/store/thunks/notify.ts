import { INotification, TAppDispatch } from "@/interfaces/store";
import { v4 as uuidv4 } from "uuid";
import { notificationActions } from "@/store/notificationSlice";
import { ENOTIFY_TYPE } from "@/constants";

export const notify = ({ type = ENOTIFY_TYPE.INFO, text, title, timeout, userName }: Partial<INotification>) => {
  console.log("timeout", timeout);
  if (!timeout) {
    switch (type) {
      case ENOTIFY_TYPE.INFO:
        timeout = 3000;
        break;
      case ENOTIFY_TYPE.ERROR:
        timeout = 5000;
        break;
      default:
        timeout = 5000;

        break;
    }
  }

  const notification: INotification = {
    id: uuidv4(),
    type,
    title: title || "",
    text: text || "",
    timeout: timeout as number,
    userName: userName || "",
  };

  return (dispatch: TAppDispatch) => {
    dispatch(notificationActions.addNotification({ notification }));

    setTimeout(() => {
      dispatch(
        notificationActions.removeNotification({
          notificationId: notification.id,
        })
      );
    }, timeout);
  };
};
