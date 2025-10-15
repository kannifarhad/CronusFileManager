import { useMemo } from "react";
import en from "../assets/translations/en";

const lang = "en";
export const useText = () => {
  const allTexts = useMemo(() => {
    switch (lang) {
      case "en":
        return en;
      default:
        return en;
    }
  }, []);
  return allTexts;
};

export default useText;
