import { useSnackbar } from "@/hooks";
import { Alert, Snackbar, Stack, Typography } from "@mui/material";
import React from "react";

import useSnackbarController from "./useSnackbarController";
import { useStyles } from "./styles";
import { ReactComponent as InfoIcon } from "@/assets/svg/info-circle-full.svg";
import { ReactComponent as UserPlusIcon } from "@/assets/svg/user-plus.svg";
import { ENOTIFY_TYPE } from "@/constants";
import { UserSlashIcon, StartRecordingIcon, StopRecordingToastIcon } from "@/assets";
import classNames from "classnames";

const icons: { [key: string]: React.ReactNode } = {
  [ENOTIFY_TYPE.SUCCESS]: <InfoIcon />,
  [ENOTIFY_TYPE.INFO]: <InfoIcon />,
  [ENOTIFY_TYPE.JOIN]: <UserPlusIcon />,
  [ENOTIFY_TYPE.REMOVE]: <UserSlashIcon />,
  [ENOTIFY_TYPE.START_RECORDING]: <StartRecordingIcon />,
  [ENOTIFY_TYPE.STOP_RECORDING]: <StopRecordingToastIcon />,
};

const SnackbarComponent: React.FC = () => {
  const { isOpen, message, severity, handleClose } = useSnackbar();
  const { closeNotificationHanler, notifications } = useSnackbarController();
  const styles = useStyles();

  return (
    <Stack className={styles.container} spacing={2}>
      <Snackbar
        className={styles.notification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={6000}
        open={isOpen}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          className={`${styles.notification} ${notification.type}`}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          autoHideDuration={notification.timeout}
          open={true}
          onClose={() => closeNotificationHanler(notification.id)}
        >
          <Alert
            icon={false}
            className={classNames(styles.toastMsg, {
              [styles.toastRemove]: notification.type === ENOTIFY_TYPE.REMOVE,
              [styles.recording]:
                notification.type === ENOTIFY_TYPE.START_RECORDING || notification.type === ENOTIFY_TYPE.STOP_RECORDING,
            })}
          >
            {icons[notification.type]}

            <div className={styles.content}>
              {notification.userName && (
                <Typography variant="body2" fontSize={"16px"}>
                  <span style={{ fontWeight: 700 }}>{notification.userName}</span>
                  <span> {notification.title}</span>
                </Typography>
              )}
              {notification.title && !notification.userName && (
                <Typography variant="body2" fontWeight={700} fontSize={"16px"}>
                  {notification.title}
                </Typography>
              )}
              {notification.text && (
                <Typography variant="body2" fontSize={"14px"} className={styles.text}>
                  {notification.text}
                </Typography>
              )}
            </div>
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default SnackbarComponent;
