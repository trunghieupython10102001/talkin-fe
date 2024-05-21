import { useAppDispatch, useAppSelector } from "@/hooks";
import { notificationActions } from "@/store/notificationSlice";

export default function useSnackbarController() {
  const notifications = useAppSelector((state) => state.notification.notifications);

  const dispatch = useAppDispatch();

  const closeNotificationHanler = (id: string) => {
    dispatch(
      notificationActions.removeNotification({
        notificationId: id,
      })
    );
  };

  return {
    notifications,
    closeNotificationHanler,
  };
}
