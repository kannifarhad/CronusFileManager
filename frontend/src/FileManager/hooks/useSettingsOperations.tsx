import { useMemo } from "react";
import {
  ImagesThumbTypeEnum,
  SettingsActionTypes,
  ViewTypeEnum,
  type OrderByType,
  type SettingsOperationsType,
} from "../types";
import { useSettingsDispatch } from "../context";

export const useSettingsOperations = (): SettingsOperationsType => {
  const dispatch = useSettingsDispatch();

  const operations: SettingsOperationsType = useMemo(
    () => ({
      handleSelectTheme: (theme: string) => {
        dispatch({
          type: SettingsActionTypes.SET_SELECTED_THEME,
          payload: theme,
        });
      },

      handleSetViewItemType: (view: ViewTypeEnum) => {
        dispatch({
          type: SettingsActionTypes.SET_ITEM_VIEW,
          payload: view,
        });
      },

      handleSetOrder: (order: OrderByType) => {
        dispatch({
          type: SettingsActionTypes.SET_SORT_ORDER_BY,
          payload: order,
        });
      },

      handleSetThumbView: (view: ImagesThumbTypeEnum) => {
        dispatch({
          type: SettingsActionTypes.SET_IMAGE_SETTINGS,
          payload: view,
        });
      },

      handleToggleFullScreen: () => {
        dispatch({ type: SettingsActionTypes.TOGGLE_FULLSCREEN, payload: null });
      },
    }),
    [dispatch]
  );
  return operations;
};

export default useSettingsOperations;
