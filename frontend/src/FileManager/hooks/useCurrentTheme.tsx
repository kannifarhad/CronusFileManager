import { useMemo } from "react";
import dark from "../themes/dark";
import light from "../themes/light";
import { type ThemeItemList } from "../types";
import { useSelectSettingsTheme } from "../context";

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
  const selectedTheme = useSelectSettingsTheme();

  const currentTheme = useMemo(
    () => themeList.find((theme) => theme.id === selectedTheme)?.theme ?? themeList[1].theme,
    [selectedTheme]
  );
  return currentTheme;
};

export default useCurrentTheme;
