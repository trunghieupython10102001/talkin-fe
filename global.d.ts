import type { Theme as MuiTheme } from "@mui/material";
import { TPaletteThemeColors } from "@/themes";
import { EEVENT_NAME } from "@/constants";

declare module "*.module.css";
declare module "*.module.scss";

interface CustomEventMap {
  [EEVENT_NAME.UPDATE_SEARCH]: CustomEvent<{
    data: { value: string };
  }>;
}

declare global {
  interface Window {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;

    ethereum?: any;
  }

  interface Theme extends MuiTheme {
    palette: MuiTheme["palette"] & {
      primary: TPaletteThemeColors;
    };
  }

  interface HTMLAudioElement {
    sinkId?: string;
    setSinkId?: (sinkId: string) => Promise<void>;
  }

  interface RTCRtpSender {
    createEncodedStreams?: any;
  }
}
