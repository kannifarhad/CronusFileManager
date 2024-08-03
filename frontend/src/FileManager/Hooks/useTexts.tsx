import { useState, useMemo, useCallback } from "react";
import { ButtonObject, PopupData, EditImage } from "../types";
import { checkSelectedFileType } from "../helpers";

export const useText = (props: any) => {
  const allTexts = useMemo(() => ({}), []);
  return allTexts;
};

export default useText;
