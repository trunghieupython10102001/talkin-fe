import { AlertColor } from "@mui/material";

export interface IDeviceInfo {
  flag: string;
  name: string;
  version: string;
}

export interface IWebcam {
  device: MediaDeviceInfo | null;
  resolution: "qvga" | "vga" | "hd";
}

export interface IExtendHTMLVideoElement extends HTMLVideoElement {
  captureStream?: () => MediaStream;
  mozCaptureStream?: () => MediaStream;
}

export interface IFormLogin {
  email: string;
  password: string;
}

export interface IFormRegister {
  email: string;
  password: string;
  lastname: string;
  firstname: string;
}

export interface ISnackbar {
  isOpen: boolean;
  message: string;
  severity?: AlertColor;
}

export interface IInviteResponse {
  id: string;
  name: string;
  startTime: string;
  description: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProfile {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthday: string;
  gender: string;
  phone: String;
  address: string;
  avatar: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  wallet: string | null;
  fullname?: string;
}

export interface IFormProfile {
  email: string;
  firstname: string;
  lastname: string;
  birthday?: string;
  gender?: string;
  phone?: String;
  address?: string;
  description?: string;
}

export enum EScreenShareOptions {
  // Share a browser tab
  BROWSER_TAB = "browser",
  // Share a window tab
  WINDOW_TAB = "monitor",
  // Share a screen
  SCREEN = "window",
}
export interface IAvatarResponse {}
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum EDrawerType {
  INFORMATION_ROOM = "information",
  USERS = "users",
  CHAT = "chat",
  ACTIVITIES = "activities",
  RECORDING = "recording",
}

export interface IMessage {
  displayName: string;
  content: string;
  sentAt: string;
}

export interface IDrawer {
  isOpen: boolean;
  type: EDrawerType;
}

export interface ILivestreamRoomsResponse {
  meta: {
    count: number;
    totalPages: number;
  };
  data: ILivestreamRoom[];
}

export interface ILivestreamRoom {
  id: string;
  name: string;
  startTime: string;
  description?: string;
  creatorId: number;
  listCategory: string[];
  thumbnail?: string;
  liveThumbnail?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  peersCount: number;
  creator?: IProfile;
  realStartTime?: string | null;
}

export interface IFormSchedule {
  id: string;
  name: string;
  date?: string;
  type: string;
  startTime: string;
  endTime: string;
  invitedEmails: string[];
  description?: string;
  hasSendMail?: boolean;
}

export type TCreateSchedule = Omit<IFormSchedule, "id">;

export enum EMeetingType {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface ILivestreamRoomInfo {
  peers?: number;
  status?: EStatusLivestream;
}

export enum EStatusLivestream {
  COMMING_SOON = "coming_soon",
  LIVE = "live",
  END = "end",
}

export interface Categories {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryResponse {
  meta: {
    count: number;
    totalPages: number;
  };
  data: Categories[];
}

export interface IFormLSSchedule {
  id?: string;
  name: string;
  date: string;
  startTime: string;
  invitedEmails: string[];
  categories: string[];
  description?: string;
  hasSendMail?: boolean;
  thumbnail?: string;
  files: string;
}

export enum ESettingMenu {
  MANAGE_RECORD = "Manage Recording",
  CHANGE_LAYOUT = "Change Layout",
  APPLY_VISUAL_EFFECTS = "Apply Visual Effects",
  SETTINGS = "Settings",
}

export enum EShareMenu {
  ENTIRE_SCREEN = "Your entire screen",
  WINDOW = "A window",
  TAB = "A tab",
}
