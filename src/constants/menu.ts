import { ESettingMenu, EShareMenu } from "@/interfaces/type";
import { GridWeb3Icon, RecordCircleIcon, StarMagicIcon, ToolIcon } from "@/assets";

export const SETTINGS_MENU = [
  { type: ESettingMenu.MANAGE_RECORD, icon: RecordCircleIcon },
  { type: ESettingMenu.CHANGE_LAYOUT, icon: GridWeb3Icon },
  { type: ESettingMenu.APPLY_VISUAL_EFFECTS, icon: StarMagicIcon },
  { type: ESettingMenu.SETTINGS, icon: ToolIcon },
];

export const SHARE_MENU = [
  { type: EShareMenu.ENTIRE_SCREEN, icon: RecordCircleIcon },
  { type: EShareMenu.WINDOW, icon: GridWeb3Icon },
  { type: EShareMenu.TAB, icon: StarMagicIcon },
];
