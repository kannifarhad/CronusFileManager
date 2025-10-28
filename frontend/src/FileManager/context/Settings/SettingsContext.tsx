import { createContext, useReducer, type ReactNode, useMemo, useContext } from "react";
import type { FileManagerAction, FileManagerState, SettingsStateType } from "../../types";
import { ImagesThumbTypeEnum, OrderByFieldEnum, SortByFieldEnum, ViewTypeEnum } from "../../types";

import settingsReducer from "./SettingsReducer";
import { readJsonFromLocalStorage } from "../../utils";
import { LOCASTORAGE_SETTINGS_KEY } from "../../config";

const settingsInitalState = {
  selectedTheme: null,
  itemsViewType: ViewTypeEnum.GRID,
  showImages: ImagesThumbTypeEnum.ICONS,
  orderFiles: {
    field: OrderByFieldEnum.NAME,
    orderBy: SortByFieldEnum.ASC,
  },
  ...readJsonFromLocalStorage<FileManagerState["settings"]>(LOCASTORAGE_SETTINGS_KEY),
};

const SettingsContext = createContext<SettingsStateType | undefined>(undefined);
const SettingsDispatchContext = createContext<React.Dispatch<FileManagerAction>>(() => {});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, disptach] = useReducer(settingsReducer, {
    ...settingsInitalState,
  });

  const settingsValue = useMemo(() => ({ state }), [state]);

  return (
    <SettingsContext.Provider value={settingsValue.state}>
      <SettingsDispatchContext.Provider value={disptach}>{children}</SettingsDispatchContext.Provider>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsContext");
  }
  return context;
};

export const useSettingsDispatch = () => {
  const context = useContext(SettingsDispatchContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsDispatchContext");
  }
  return context;
};

export const useSettingsOrder = () => {
  return useSettings().orderFiles;
};

export const useSelectSettingsTumbs = () => {
  return useSettings().showImages;
};

export const useSelectSettingsTheme = () => {
  return useSettings().selectedTheme;
};
