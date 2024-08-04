import { useMemo } from "react";

export const useText = (props: any) => {
  const allTexts = useMemo(() => ({ ...props }), []);
  return allTexts;
};

export default useText;
