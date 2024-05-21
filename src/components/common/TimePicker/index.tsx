import * as React from "react";
import { TextFieldProps } from "@mui/material";
import type { Moment } from "moment";

import { StaticTimePicker, TimePicker as MuiTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import classNames from "classnames";
interface IComponentProps {
  value: Moment | null;
  disabled?: boolean;
  format?: string;
  popupLayoutClassname?: string;
  popupToolbarClassname?: string;
  inputProps: TextFieldProps;
  activeAMClassNames?: string;
  activePMClassNames?: string;
  onChange: (value: Moment | null) => void;
}

function TimePicker({
  disabled = false,
  format = "hh:mm A",
  inputProps,
  popupLayoutClassname,
  popupToolbarClassname,
  activeAMClassNames = "",
  activePMClassNames = "",
  value,
  onChange,
}: IComponentProps) {
  const [isOpenPickerPopup, setIsOpenPickerPopup] = React.useState(false);
  const [pickerTime, setPickerTime] = React.useState<Moment | null>(() => moment(value));
  const isCancelUpdateTime = React.useRef(true);

  const acceptPickedTimeHandler = () => {
    onChange(pickerTime);
    setIsOpenPickerPopup(false);
    isCancelUpdateTime.current = false;
  };

  const pickerPopupOpenHandler = () => {
    isCancelUpdateTime.current = true;
    setIsOpenPickerPopup(true);
  };

  const pickerCloseHandler = () => {
    setIsOpenPickerPopup(false);
    if (isCancelUpdateTime.current) {
      setPickerTime(value);
    }
  };

  const isAMActive = React.useMemo(() => {
    if (!pickerTime || !pickerTime.isValid()) {
      return true;
    }

    return pickerTime.hour() < 12;
  }, [pickerTime]);

  return (
    <MuiTimePicker
      format={format}
      value={value}
      disabled={disabled}
      onChange={onChange}
      open={isOpenPickerPopup}
      onOpen={pickerPopupOpenHandler}
      onClose={pickerCloseHandler}
      slots={{
        layout: () => {
          return (
            <StaticTimePicker
              ampmInClock
              ampm
              slotProps={{
                layout: {
                  className: classNames(popupLayoutClassname, {
                    [activeAMClassNames]: isAMActive,
                    [activePMClassNames]: !isAMActive,
                  }),
                },
                toolbar: {
                  className: popupToolbarClassname,
                },
                actionBar() {
                  return { actions: ["accept"], onAccept: acceptPickedTimeHandler };
                },
              }}
              value={pickerTime}
              onChange={(time) => setPickerTime(time)}
              onAccept={acceptPickedTimeHandler}
            />
          );
        },
      }}
      slotProps={{
        textField: inputProps,
      }}
    />
  );
}

export default TimePicker;
