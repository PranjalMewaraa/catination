// hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchFiles } from "../store/slices/filesSlice";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook example
export const useFiles = () => {
  const dispatch = useAppDispatch();
  const { files, loading, error } = useAppSelector((state) => state.files);

  const loadFiles = () => {
    dispatch(fetchFiles());
  };

  return { files, loading, error, loadFiles };
};
