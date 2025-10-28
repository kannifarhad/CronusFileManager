import { useMemo } from "react";
import type { Message, SystemOperationsType, VolumeListItem } from "../types";
import { SystemActionTypes } from "../types";
import { useSystemDispatch } from "../context";

export const useSystemOperations = (): SystemOperationsType => {
  const dispatch = useSystemDispatch();

  return useMemo(() => {
    const setMessage = (message: Omit<Message, "id">) => {
      dispatch({
        type: SystemActionTypes.SET_MESSAGES,
        payload: {
          id: String(Date.now()),
          ...message,
        },
      });
    };

    const removeMessage = (id: string) => {
      dispatch({
        type: SystemActionTypes.REMOVE_MESSAGES,
        payload: { id },
      });
    };

    const handleApiError = (error: unknown, errorTitle: string) => {
      dispatch({
        type: SystemActionTypes.SET_LOADING,
        payload: false,
      });
      dispatch({
        type: SystemActionTypes.SET_MESSAGES,
        payload: {
          id: String(Date.now()),
          title: errorTitle,
          type: "error",
          message: error instanceof Error ? error.message : (error as any)?.message || "Unknown error",
        },
      });
    };

    const handleSelectVolume = (selectedVolumeItem: VolumeListItem) => {
      dispatch({
        type: SystemActionTypes.SET_SELECTED_VOLUME,
        payload: selectedVolumeItem,
      });
    };

    const setLoading = (value: boolean) => {
      dispatch({
        type: SystemActionTypes.SET_LOADING,
        payload: value,
      });
    };

    return {
      setMessage,
      removeMessage,
      handleApiError,
      handleSelectVolume,
      setLoading,
    };
  }, [dispatch]);
};

export default useSystemOperations;
