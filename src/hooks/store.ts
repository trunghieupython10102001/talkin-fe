import { TAppDispatch, TAppState } from "@/interfaces/store";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const useAppDispatch = useDispatch as () => TAppDispatch;
export const useAppSelector: TypedUseSelectorHook<TAppState> = useSelector;
