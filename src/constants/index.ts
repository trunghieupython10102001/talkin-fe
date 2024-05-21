export * from "constants/menu";

export enum COOKIES_STORAGE_KEY {
  ACCESS_TOKEN = "accessToken",
}

export enum ENOTIFY_TYPE {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
  JOIN = "join",
  MESSAGE = "message",
  REMOVE = "remove",
  START_RECORDING = "start-recording",
  STOP_RECORDING = "stop-recording",
}
export enum SESSION_STORAGE_KEY {
  MIC_ID = "micId",
  SPEAKER_ID = "speakerId",
  CAMERA_ID = "cameraId",
}

export enum ELIVESTREAM_STATUS {
  LIVE = "live",
  COMMING_SOON = "coming_soon",
  END = "end",
}

export enum EEVENT_NAME {
  UPDATE_SEARCH = "UPDATE_SEARCH",
}
