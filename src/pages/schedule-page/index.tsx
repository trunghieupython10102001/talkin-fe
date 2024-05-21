import { useState } from "react";
import {
  Grid,
  Typography,
  InputLabel,
  TextField,
  Card,
  Button,
  Select,
  MenuItem,
  Chip,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStyles } from "./styles";
import { useUpdateSchedule } from "./hook/useUpdateSchedule";
import moment from "moment";
import { EMeetingType } from "@/interfaces/type";
import { Link, useNavigate } from "react-router-dom";
import CustomTimePicker from "@/components/common/TimePicker";
import { MultiEmailInput } from "@/components/common/MultiEmailInput";
import { ReactComponent as CloseIcon } from "@/assets/svg/close.svg";
import classNames from "classnames";
import ConfirmEmail from "@/components/common/confirm-email";
import { DownIcon } from "@/assets";
import { Paths } from "@/constants/path";

export const SchedulePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const {
    meetingId,
    UpdateScheduleFormik,
    scheduleEndTime,
    waitingRoomLink,
    scheduleStartTime,
    inputtingEmail,
    isOpenSendMail,
    isRemoveMeeting,
    isOpenCancelMail,
    updateEndTime,
    updateStartTime,
    handleSendMail,
    setIsOpenSendMail,
    setIsRemoveMeeting,
    handleConfirmRemoveMeeting,
    setOpenCancelMail,
    datePickerBlurHandler,
  } = useUpdateSchedule();

  const [isViewMode, setIsViewMode] = useState<boolean>(true);

  const updateDate = UpdateScheduleFormik.handleChange("date");

  const isUpdateMode = !!meetingId;

  return (
    <Card className={classes.profileContainer}>
      <Typography variant="h5" align="center">
        {/* {isUpdateMode && isViewMode ? "You have successfully schedule a meeting!" : "Schedule a meeting"} */}
        Schedule a meeting
      </Typography>
      {isViewMode && isUpdateMode && (
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            navigate(Paths.Home);
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      {isUpdateMode && <div className={classes.subTitle}>Here&#8217;s your meeting info:</div>}
      <Grid
        className={classes.formContainer}
        container
        component="form"
        spacing={2}
        // onSubmit={() => {
        //   setIsViewMode(true);
        //   UpdateScheduleFormik.handleSubmit();
        //   setIsOpenSendMail(true);
        // }}
      >
        <Grid item md={12}>
          <InputLabel htmlFor="name" required>
            Title
          </InputLabel>
          <TextField
            id="name"
            name="name"
            disabled={isViewMode && isUpdateMode}
            placeholder="Title"
            value={UpdateScheduleFormik.values.name}
            onChange={UpdateScheduleFormik.handleChange("name")}
            onBlur={UpdateScheduleFormik.handleBlur("name")}
            autoComplete="off"
            error={!!UpdateScheduleFormik.errors.name && !!UpdateScheduleFormik.touched.name}
            helperText={!!UpdateScheduleFormik.touched.name && UpdateScheduleFormik.errors.name}
          />
        </Grid>

        <Grid item md={6}>
          <InputLabel htmlFor="date" required>
            Date
          </InputLabel>
          <DatePicker
            format="DD/MM/YYYY"
            value={UpdateScheduleFormik.values.date ? moment(UpdateScheduleFormik.values.date) : null}
            onChange={(value: moment.Moment | null) => {
              UpdateScheduleFormik.setFieldError("date", undefined);
              value ? updateDate(moment(value).format("YYYY-MM-DD")) : updateDate("");
              console.log("value date:", value);
            }}
            slotProps={{
              textField: {
                id: "date",
                name: "date",
                error: !!UpdateScheduleFormik.errors.date && !!UpdateScheduleFormik.touched.date,
                helperText: !!UpdateScheduleFormik.touched.date && UpdateScheduleFormik.errors.date,
                onBlur: datePickerBlurHandler,
                // InputProps: {
                //   tabIndex: -1,
                //   onBlur(event) {
                //     console.log("Date picker container blur", event);
                //   },
                // },
              },
            }}
            disabled={isViewMode && isUpdateMode}
            disablePast
          />
        </Grid>

        <Grid item md={6}>
          <InputLabel id="select-type" required>
            Type
          </InputLabel>
          <FormControl error={!!UpdateScheduleFormik.errors.type && !!UpdateScheduleFormik.touched.type}>
            <Select
              labelId="select-type"
              id="type"
              name="type"
              value={UpdateScheduleFormik.values.type}
              onChange={(event) => {
                UpdateScheduleFormik.setFieldValue(event.target.name, event.target.value).then(() => {
                  UpdateScheduleFormik.setFieldTouched(event.target.name, true);
                });
              }}
              disabled={isViewMode && isUpdateMode}
              className={classes.meetingTypeDropdown}
              MenuProps={{
                PopoverClasses: {
                  paper: classes.selectDropdownContainer,
                },
              }}
              IconComponent={DownIcon}
              onClose={(event) => {
                UpdateScheduleFormik.setFieldTouched("type", true);
              }}
            >
              <MenuItem value={EMeetingType.PUBLIC}>Public</MenuItem>
              <MenuItem value={EMeetingType.PRIVATE}>Private</MenuItem>
            </Select>
            <FormHelperText>{!!UpdateScheduleFormik.touched.type && UpdateScheduleFormik.errors.type}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={6}>
          <InputLabel id="startTime" required>
            Start time
          </InputLabel>
          <CustomTimePicker
            value={scheduleStartTime}
            disabled={isViewMode && isUpdateMode}
            popupLayoutClassname={classes.timePicker}
            activeAMClassNames={classes.timePickerActivingAM}
            activePMClassNames={classes.timePickerActivingPM}
            popupToolbarClassname={classes.timePickerToolbar}
            inputProps={{
              name: "startTime",
              error: !!UpdateScheduleFormik.errors.startTime && !!UpdateScheduleFormik.touched.startTime,
              helperText: !!UpdateScheduleFormik.touched.startTime && UpdateScheduleFormik.errors.startTime,
              onBlur: UpdateScheduleFormik.handleBlur,
            }}
            onChange={updateStartTime}
          />
        </Grid>
        <Grid item md={6}>
          <InputLabel id="end-time" required>
            End time
          </InputLabel>
          <CustomTimePicker
            value={scheduleEndTime}
            disabled={isViewMode && isUpdateMode}
            popupLayoutClassname={classes.timePicker}
            activeAMClassNames={classes.timePickerActivingAM}
            activePMClassNames={classes.timePickerActivingPM}
            popupToolbarClassname={classes.timePickerToolbar}
            inputProps={{
              name: "endTime",
              error: !!UpdateScheduleFormik.errors.endTime && !!UpdateScheduleFormik.touched.endTime,
              helperText: !!UpdateScheduleFormik.touched.endTime && UpdateScheduleFormik.errors.endTime,
              onBlur: UpdateScheduleFormik.handleBlur,
            }}
            onChange={updateEndTime}
          />
        </Grid>
        <Grid item md={12}>
          <InputLabel htmlFor="invitedEmails" required>
            Recipients
          </InputLabel>

          <MultiEmailInput
            id="invitedEmails"
            name="invitedEmails"
            disabled={isViewMode && isUpdateMode}
            placeholder="Type guest's email here, press Enter after each email"
            initialInputValue={inputtingEmail}
            emails={UpdateScheduleFormik.values.invitedEmails}
            error={
              (!!UpdateScheduleFormik.touched.invitedEmails && !!UpdateScheduleFormik.errors.invitedEmails) ||
              (!!UpdateScheduleFormik.touched.tempEmail && !!UpdateScheduleFormik.errors.tempEmail)
            }
            helperText={
              !!UpdateScheduleFormik.touched.invitedEmails &&
              (UpdateScheduleFormik.errors.tempEmail || UpdateScheduleFormik.errors.invitedEmails)
            }
            inputProps={{
              maxLength: 254,
            }}
            getLabel={(email, index, removeEmail) => {
              return (
                <Chip
                  className={classes.emailTag}
                  key={index}
                  label={email}
                  onDelete={() => removeEmail(index)}
                  deleteIcon={
                    <IconButton disabled={isViewMode && isUpdateMode}>
                      <CloseIcon />
                    </IconButton>
                  }
                />
              );
            }}
            onChange={(emails) => {
              UpdateScheduleFormik.setFieldValue("invitedEmails", emails, true).then(() => {
                UpdateScheduleFormik.setFieldTouched("invitedEmails", true);
              });
            }}
            onBlur={(ev) => {
              UpdateScheduleFormik.handleBlur(ev);
              UpdateScheduleFormik.setTouched({
                ...UpdateScheduleFormik.touched,
                invitedEmails: true,
                tempEmail: true,
              }).then(() => {
                if (inputtingEmail) {
                  UpdateScheduleFormik.validateField("tempEmail");
                }
              });
            }}
            onChangeInput={(tempEmail) => {
              UpdateScheduleFormik.setFieldValue("tempEmail", tempEmail).then(() => {
                UpdateScheduleFormik.setErrors({ tempEmail: undefined, invitedEmails: undefined });
              });
            }}
          />
        </Grid>
        <Grid item md={12}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <TextField
            id="description"
            disabled={isViewMode && isUpdateMode}
            placeholder="Description"
            value={UpdateScheduleFormik.values.description}
            onChange={UpdateScheduleFormik.handleChange}
            onBlur={UpdateScheduleFormik.handleBlur("description")}
            autoComplete="off"
            error={!!UpdateScheduleFormik.touched.description && !!UpdateScheduleFormik.errors.description}
            helperText={!!UpdateScheduleFormik.touched.description && UpdateScheduleFormik.errors.description}
          />
        </Grid>
        {isUpdateMode && (
          <Grid item md={12}>
            <div className={classes.detailSchedule}>
              <p>
                <strong>Meeting&#8217;s link: </strong>
                <Link to={waitingRoomLink} target="_blank">
                  Link
                </Link>
              </p>
              <p>
                <strong>Meeting&#8217;s ID: </strong>
                <span>{meetingId}</span>
              </p>
            </div>
          </Grid>
        )}
        {isUpdateMode && isViewMode ? (
          <Grid item md={12} className={classNames(classes.groupButton, classes.editButton)}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => {
                setIsViewMode(false);
              }}
            >
              Edit
            </Button>
          </Grid>
        ) : (
          <Grid item md={12} className={classes.groupButton}>
            <Button
              fullWidth
              variant="contained"
              className={classNames(classes.button, classes.cancelButton)}
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            {isUpdateMode && (
              <Button
                fullWidth
                variant="contained"
                className={classNames(classes.button, classes.removeButton)}
                onClick={() => {
                  setIsRemoveMeeting(true);
                }}
              >
                Remove
              </Button>
            )}
            <Button
              fullWidth
              variant="contained"
              className={classNames(classes.button)}
              onClick={() => {
                setIsViewMode(true);
                UpdateScheduleFormik.handleSubmit();
                setIsOpenSendMail(true);
              }}
              disabled={!(UpdateScheduleFormik.dirty && UpdateScheduleFormik.isValid)}
            >
              {isUpdateMode ? "Update" : "Create"}
            </Button>
          </Grid>
        )}
      </Grid>
      <ConfirmEmail
        isOpen={isOpenSendMail}
        onClose={() => setIsOpenSendMail(false)}
        title={isUpdateMode ? "Send notification email" : "Send invitation email"}
        content={
          isUpdateMode
            ? "Would you like to send notification emails to guests?"
            : "Would you like to send invitation emails to guests?"
        }
        onCancel={() => handleSendMail(false)}
        onSubmit={() => handleSendMail(true)}
      />
      <ConfirmEmail
        isOpen={isRemoveMeeting}
        onClose={() => setIsRemoveMeeting(false)}
        title="Remove a meeting"
        content="Would you like to remove this meeting from the system?"
        onCancel={() => setIsRemoveMeeting(false)}
        onSubmit={() => {
          setIsRemoveMeeting(false);
          setOpenCancelMail(true);
        }}
      />
      <ConfirmEmail
        isOpen={isOpenCancelMail}
        onClose={() => setOpenCancelMail(false)}
        title="Send cancellation email"
        content="Would you like to send cancellation emails to guests?"
        onCancel={() => {
          setOpenCancelMail(false);
          handleConfirmRemoveMeeting(meetingId, false);
        }}
        onSubmit={() => handleConfirmRemoveMeeting(meetingId, true)}
      />
    </Card>
  );
};
