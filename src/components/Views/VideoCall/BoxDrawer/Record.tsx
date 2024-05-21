import React from "react";
import { useStyles } from "./styles";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CloseIcon } from "@/assets";
import { RecordingDialog } from "../../Recording/RecordingDialog";
import { useRecording } from "./hooks/useRecording";
import { StopRecordingWhiteIcon } from "@/assets";

const Record: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const classes = useStyles();

  const {
    isStartRecording,
    isStopRecording,
    setStartRecording,
    setStopRecording,
    handleStartRecording,
    handleStopRecording,
    me,
  } = useRecording();

  return (
    <>
      <Box component="div" height="3rem" className={classes.title}>
        <Typography component="h2" variant="h6">
          Recording
        </Typography>
        <CloseIcon onClick={onClose} className={classes.close} />
      </Box>
      <Box component="div" className={classes.boxDrawerContent}>
        <Stack spacing={3}>
          <Box component="div">
            <Typography component="p">Record you video call</Typography>
            <Typography component="p">
              An email with the recording’s sharable link will be send to the host’s email address once it’s ready
            </Typography>
          </Box>
          <Box component="div">
            {me.isRecording ? (
              <Button
                variant="contained"
                className={classes.stopRecording}
                fullWidth
                onClick={() => setStopRecording(true)}
              >
                <StopRecordingWhiteIcon />
                <Typography component="div" fontWeight={700} marginLeft={"10px"}>
                  Stop recording
                </Typography>
              </Button>
            ) : (
              <Button variant="contained" fullWidth onClick={() => setStartRecording(true)}>
                <Typography component="div" fontWeight={700}>
                  Start recording
                </Typography>
              </Button>
            )}
          </Box>
        </Stack>
      </Box>

      <RecordingDialog
        isOpen={isStartRecording}
        onClose={() => setStartRecording(false)}
        onSubmit={() => handleStartRecording(me.id || "")}
        title={"Make sure everyone is ready"}
        content={
          "Recording a meeting without the consent of all participants may be illegal and actionable. You should obtain consent to record this meeting from all participants, including external guests and guests who join late."
        }
        submitLabel={"Start"}
      />

      <RecordingDialog
        isOpen={isStopRecording}
        onClose={() => setStopRecording(false)}
        onSubmit={() => handleStopRecording(me.id || "")}
        title={"Stop recording this video call?"}
        content={
          "The recording will be saved in the system and an email with the recording’s sharable link will be sent to the host’s email address once it’s ready."
        }
        submitLabel={"Stop recording"}
      />
    </>
  );
};

export default Record;
