import React from "react";
import { iconMap } from "../Assets/Icons/line";

export type IconName = keyof typeof iconMap;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  color?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ name, color = "#ccc", size = 15, ...rest }) => {
  const SelectedIcon = iconMap[name];

  if (!SelectedIcon) {
    console.warn(`Icon not found: ${name}`);
    return null;
  }

  return <SelectedIcon width={size} height={size} fill={color} {...rest} />;
};

export default Icon;
