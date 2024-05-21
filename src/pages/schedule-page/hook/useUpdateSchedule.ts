import { useState, useEffect, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import { TCreateSchedule, IFormSchedule } from "@/interfaces/type";
import { CreateScheduleValidation } from "./ScheduleValidation";
import { useAppDispatch } from "@/hooks/store";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import moment, { Moment } from "moment";
import { createSchedule, deleteSchedule, getDetailSchedule, updateSchedule } from "@/api/schedule";
import { notify } from "@/store/thunks/notify";
import { ENOTIFY_TYPE } from "@/constants";
import { Paths } from "@/constants/path";
import _ from "lodash";
import { CodeError } from "@/constants/codeError";
import { AxiosError } from "axios";

function calculateClockTimeFromDate(clockTime: string | Moment, date?: string) {
  const time = moment(clockTime);

  if (date) {
    const currentDate = moment(date);
    time.year(currentDate.year()).month(currentDate.month()).date(currentDate.date());
  }

  return time;
}

export const useUpdateSchedule = () => {
  const [scheduleItem, setScheduleItem] = useState<IFormSchedule>();
  const [data, setData] = useState<IFormSchedule | (TCreateSchedule & { tempEmail?: string })>({
    name: "",
    date: "",
    type: "",
    startTime: "",
    endTime: "",
    invitedEmails: [],
    description: "",
    tempEmail: "",
  });
  const [isOpenSendMail, setIsOpenSendMail] = useState<boolean>(false);
  const [isRemoveMeeting, setIsRemoveMeeting] = useState<boolean>(false);
  const [isOpenCancelMail, setOpenCancelMail] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { meetingId: _meetingId } = useParams();

  const isUpdateMode = !!_meetingId;

  const navigate = useNavigate();

  const UpdateScheduleFormik = useFormik<Omit<IFormSchedule, "id"> & { tempEmail?: string }>({
    enableReinitialize: true,
    initialValues: {
      name: scheduleItem?.name || "",
      date: scheduleItem?.startTime || "",
      type: scheduleItem?.type || "",
      startTime: scheduleItem?.startTime || "",
      endTime: scheduleItem?.endTime || "",
      invitedEmails: scheduleItem?.invitedEmails || [],
      description: scheduleItem?.description || "",
      tempEmail: "",
    },
    validationSchema: CreateScheduleValidation,
    validateOnMount: true,
    onSubmit: (values) => {
      const updatedValue = { ...values };

      delete updatedValue.tempEmail;
      setData(updatedValue);
    },
  });

  const handleSendMail = (isSend: boolean) => {
    const body = { ...data, hasSendMail: isSend };
    if (isUpdateMode) {
      handleupdateSchedule({ ...body, id: _meetingId });
    } else handleCreateSchedule(body);

    setIsOpenSendMail(false);
  };

  const handleCreateSchedule = async (data: TCreateSchedule) => {
    if (!data || !data.date) return;

    const startTime = calculateClockTimeFromDate(data.startTime, data.date).toISOString(); // handleChangeDate(data?.date, data.startTime);
    const endTime = calculateClockTimeFromDate(data.endTime, data.date).toISOString(); // handleChangeDate(data?.date, data.endTime);

    const dataWithoutDate = _.omit(data, "date");

    setIsLoading(true);

    try {
      const res = await createSchedule({
        ...dataWithoutDate,
        startTime,
        endTime,
      });
      if (res?.data) {
        setScheduleItem(res.data);
        dispatch(
          notify({
            title: "Schedule successfully!",
          })
        );

        navigate(generatePath(Paths.SchedulePage, { meetingId: res.data.id }));
      }
    } catch (error: any) {
      console.log("handleCreateSchedule error");
      console.dir(error);

      if (error instanceof AxiosError && error.response && error.response.status >= 500) {
        dispatch(
          notify({
            text: "Failed to create!",
            title: "Internal Server Error",
            type: ENOTIFY_TYPE.ERROR,
          })
        );
        return;
      }

      dispatch(
        notify({
          text: "Failed to create!",
          title: "Create schedule",
          type: ENOTIFY_TYPE.ERROR,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleupdateSchedule = async (data: IFormSchedule) => {
    if (!data || !data.date) return;

    const startTime = calculateClockTimeFromDate(data.startTime, data.date).toISOString(); // handleChangeDate(data?.date, data.startTime);
    const endTime = calculateClockTimeFromDate(data.endTime, data.date).toISOString(); // handleChangeDate(data?.date, data.endTime);

    const dataWithoutDate = _.omit(data, "date");

    setIsLoading(true);
    try {
      const res = await updateSchedule({
        ...dataWithoutDate,
        startTime,
        endTime,
      });
      if (res?.status === 200) {
        dispatch(
          notify({
            title: "Update successfully!",
          })
        );

        setScheduleItem({ ...dataWithoutDate, date: data.date });
      }
    } catch (error: any) {
      console.log(error);

      dispatch(
        notify({
          text: "Failed to update!",
          title: "Update schedule",
          type: ENOTIFY_TYPE.ERROR,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRemoveMeeting = (meetingId?: string, isCancelMail?: boolean) => {
    if (meetingId) {
      handleDeleteSchedule(meetingId, isCancelMail);
    }
  };

  const handleDeleteSchedule = async (meetingId: string, isCancelMail?: boolean) => {
    if (!meetingId) return;

    setIsLoading(true);
    try {
      const res = await deleteSchedule(meetingId, isCancelMail);

      if (res) {
        dispatch(
          notify({
            title: "Remove successfully!",
          })
        );

        navigate(Paths.RemoveMeeting);
      }
    } catch (error: any) {
      console.log(error);

      dispatch(
        notify({
          text: "Failed to remove!",
          title: "Remove schedule",
          type: ENOTIFY_TYPE.ERROR,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateStartTime = useCallback(
    (value: Moment | null) => {
      if (!value) {
        UpdateScheduleFormik.setFieldValue("startTime", "").then(() => {
          UpdateScheduleFormik.setFieldTouched("startTime", true);
        });
        return;
      }

      const updatedStartTime = calculateClockTimeFromDate(value, UpdateScheduleFormik.values.date);

      UpdateScheduleFormik.setFieldValue("startTime", updatedStartTime.toISOString()).then(() => {
        UpdateScheduleFormik.setFieldTouched("startTime", true);
      });
    },
    [UpdateScheduleFormik]
  );

  const updateEndTime = useCallback(
    (value: Moment | null) => {
      if (!value) {
        UpdateScheduleFormik.setFieldValue("endTime", "").then(() => {
          UpdateScheduleFormik.setFieldTouched("endTime", true);
        });
        return;
      }

      const updatedEndTime = calculateClockTimeFromDate(value, UpdateScheduleFormik.values.date);

      UpdateScheduleFormik.setFieldValue("endTime", updatedEndTime.toISOString()).then(() => {
        UpdateScheduleFormik.setFieldTouched("endTime", true);
      });
    },
    [UpdateScheduleFormik]
  );

  const handleGetDetailsSchedule = useCallback(async () => {
    if (!_meetingId) return;

    setIsLoading(true);
    try {
      const res = await getDetailSchedule(_meetingId);

      if (res.data)
        if (res.data) {
          setScheduleItem(res.data);
        }
    } catch (error: any) {
      const status = error?.response?.status;

      const code = error?.response?.data?.message;

      if (code === CodeError.MEETING_ROOM_CANCELLED) {
        dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: "Meeting room cancelled",
          })
        );
        navigate(Paths.Home);
      } else if (code === CodeError.ROOM_NOT_EXISTED || status === 404) {
        dispatch(
          notify({
            type: ENOTIFY_TYPE.ERROR,
            text: "Room ID not existed",
          })
        );
        navigate(Paths.Home);
      }
    } finally {
      setIsLoading(false);
    }
  }, [_meetingId, dispatch, navigate]);

  const datePickerBlurHandler: React.FocusEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback(
    (blurEvent) => {
      UpdateScheduleFormik.setFieldTouched("date", true);
      if (!blurEvent.relatedTarget) {
        return;
      }

      const relatedElParent = (blurEvent.relatedTarget as Element).closest(".MuiInputBase-root");
      const inputElParent = (blurEvent.target as Element).closest(".MuiInputBase-root");

      if (relatedElParent === inputElParent) {
        UpdateScheduleFormik.setErrors({ date: undefined });
      }
    },
    [UpdateScheduleFormik]
  );

  const scheduleStartTime = useMemo(() => {
    return calculateClockTimeFromDate(UpdateScheduleFormik.values.startTime, UpdateScheduleFormik.values.date);
  }, [UpdateScheduleFormik.values.date, UpdateScheduleFormik.values.startTime]);

  const scheduleEndTime = useMemo(() => {
    return calculateClockTimeFromDate(UpdateScheduleFormik.values.endTime, UpdateScheduleFormik.values.date);
  }, [UpdateScheduleFormik.values.date, UpdateScheduleFormik.values.endTime]);

  const waitingRoomLink = useMemo(() => {
    if (!_meetingId) {
      return "";
    }

    return generatePath(Paths.WaitingRoom, { roomId: _meetingId });
  }, [_meetingId]);

  useEffect(() => {
    if (!_meetingId) return;

    handleGetDetailsSchedule();
  }, [_meetingId, handleGetDetailsSchedule]);

  return {
    meetingId: _meetingId,
    UpdateScheduleFormik,
    waitingRoomLink,
    scheduleItem,
    isLoading,
    scheduleStartTime,
    scheduleEndTime,
    inputtingEmail: UpdateScheduleFormik.values.tempEmail,
    isOpenSendMail,
    isRemoveMeeting,
    isOpenCancelMail,

    updateStartTime,
    updateEndTime,
    handleupdateSchedule,
    handleCreateSchedule,
    handleDeleteSchedule,
    handleGetDetailsSchedule,
    handleSendMail,
    setIsOpenSendMail,
    setIsRemoveMeeting,
    handleConfirmRemoveMeeting,
    setOpenCancelMail,
    datePickerBlurHandler,
  };
};
