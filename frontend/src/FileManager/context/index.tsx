import type { ReactNode } from "react";
import type { VolumeListType } from "../types";
import { FileManagerProviderOld } from "./OldContext";
import { SettingsProvider } from "./Settings/SettingsContext";
import { SystemProvider } from "./System/SystemContext";
export * from "./OldContext";
export * from "./Settings/SettingsContext";
export * from "./System/SystemContext";

export function FileManagerProvider({
  children,
  selectItemCallback,
  volumesList,
}: {
  children: ReactNode;
  selectItemCallback: ((filePath: string) => void) | undefined;
  volumesList: VolumeListType;
}) {
  return (
    <SystemProvider volumesList={volumesList}>
      <SettingsProvider>
        <FileManagerProviderOld selectItemCallback={selectItemCallback} volumesList={volumesList}>
          {children}
        </FileManagerProviderOld>
      </SettingsProvider>
    </SystemProvider>
  );
}
