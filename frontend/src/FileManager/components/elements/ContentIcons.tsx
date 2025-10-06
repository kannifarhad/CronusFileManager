import React from "react";
import { imagesMap } from "../../utils/assets/icons/files";

export type ContentIconType = keyof typeof imagesMap;

export interface ContentIconsProps extends React.SVGProps<SVGSVGElement> {
  name: ContentIconType;
  color?: string;
  size?: number;
}

const ContentIcons: React.FC<ContentIconsProps> = ({ name, color = "#2a2a2a", size = 15, ...rest }) => {
  const SelectedIcon = imagesMap[name];

  if (!SelectedIcon) {
    console.warn(`Icon not found: ${name}`);
    return null;
  }

  return <SelectedIcon className="content-icon" width={size} height={size} fill={color} {...rest} />;
};

export default ContentIcons;
