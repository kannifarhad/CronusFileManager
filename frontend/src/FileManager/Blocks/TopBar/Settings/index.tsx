import { memo } from "react";
import ImageViewOptions from "./ImageViewOptions";
import SortingOptions from "./SortingOptions";
import ThemeSelection from "./ThemeSelection";

const Settings = () => (
  <>
    <SortingOptions />
    <ThemeSelection />
    <ImageViewOptions />
  </>
);

export default memo(Settings);
