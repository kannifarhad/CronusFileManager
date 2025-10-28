import { createContext, useReducer, type ReactNode, useContext } from "react";
import type { FileManagerAction, SystemStateType, VolumeListType } from "../../types";

import systemReducer from "./SystemReducer";

const systemInitalState = {
  messages: [],
  loading: false,
  volumesList: [],
  selectedVolume: null,
};

const SystemContext = createContext<SystemStateType | undefined>(undefined);
const SystemDispatchContext = createContext<React.Dispatch<FileManagerAction>>(() => {});

export function SystemProvider({ children, volumesList }: { children: ReactNode; volumesList: VolumeListType }) {
  const [state, disptach] = useReducer(systemReducer, {
    ...systemInitalState,
    volumesList: volumesList,
  });

  return (
    <SystemContext.Provider value={state}>
      <SystemDispatchContext.Provider value={disptach}>{children}</SystemDispatchContext.Provider>
    </SystemContext.Provider>
  );
}

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemContext");
  }
  return context;
};

export const useSystemDispatch = () => {
  const context = useContext(SystemDispatchContext);
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemDispatchContext");
  }
  return context;
};

export const useSelectLoading = () => {
  return useSystem().loading;
};

export const useSelectSystemMessages = () => {
  return useSystem().messages;
};

export const useSelectSystemVolume = () => {
  return useSystem().selectedVolume;
};
