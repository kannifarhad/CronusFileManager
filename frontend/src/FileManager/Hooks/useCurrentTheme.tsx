import { useMemo } from "react";
import dark from "../Themes/dark";
import light from "../Themes/light";
import { useFileManagerState } from "../ContextStore/FileManagerContext";
import { ThemeItemList } from "../types";

export const themeList: ThemeItemList = [
  {
    id: "darkTheme",
    name: "Dark",
    theme: dark,
  },
  {
    id: "lightTheme",
    name: "Light",
    theme: light,
  },
];
export const useCurrentTheme = () => {
  const { settings } = useFileManagerState();
  const currentTheme = useMemo(
    () =>
      themeList.find((theme) => theme.id === settings.selectedTheme)?.theme ??
      themeList[1].theme,
    [settings.selectedTheme]
  );
  return currentTheme;
};

export default useCurrentTheme;
