import React from "react";

// Import SVGs using  suffix (SVGR via vite-plugin-svgr)
import SettingsGearIcon from "../Assets/Icons/settingsGear.svg";
import SettingsLines from "../Assets/Icons/settingsLines.svg";
import Backward from "../Assets/Icons/backward.svg";
import Forward from "../Assets/Icons/forward.svg";
import AddFile from "../Assets/Icons/add.svg";
import AddFolder from "../Assets/Icons/addFolder.svg";
import Upload from "../Assets/Icons/upload.svg";
import Refresh from "../Assets/Icons/refresh.svg";
import Copy from "../Assets/Icons/copy.svg";
import Cut from "../Assets/Icons/cut.svg";
import Trash from "../Assets/Icons/trash.svg";
import Paste from "../Assets/Icons/paste.svg";
import DeleteFolder from "../Assets/Icons/delete-folder.svg";
import Layers from "../Assets/Icons/layers.svg";
import Text from "../Assets/Icons/text.svg";
import PaintPalette from "../Assets/Icons/paint-palette.svg";
import Cursor from "../Assets/Icons/cursor.svg";
import SelectAll from "../Assets/Icons/selectAll.svg";
import Zip from "../Assets/Icons/zip.svg";
import UnZip from "../Assets/Icons/unZip.svg";
import View from "../Assets/Icons/view.svg";
import Information from "../Assets/Icons/information.svg";
import Outbox from "../Assets/Icons/outbox.svg";
import Download from "../Assets/Icons/download.svg";
import GridView from "../Assets/Icons/gridView.svg";
import ListView from "../Assets/Icons/listView.svg";
import Resize from "../Assets/Icons/resize.svg";
import Folder from "../Assets/Icons/folder.svg";
import FolderOpen from "../Assets/Icons/folderOpen.svg";
import Cancel from "../Assets/Icons/cancel.svg";
import Cancel2 from "../Assets/Icons/cancel-1.svg";
import Ban from "../Assets/Icons/ban.svg";
import Next from "../Assets/Icons/next.svg";
import Save from "../Assets/Icons/save.svg";
import Exit from "../Assets/Icons/exit.svg";
import Pencil from "../Assets/Icons/pencil.svg";
import Search from "../Assets/Icons/loupe.svg";
import Volume from "../Assets/Icons/vol3.svg";

// Define the type for imported SVGs
type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;

// Map of all icon components
const iconMap = {
  Information,
  Search,
  Pencil,
  Exit,
  Save,
  Next,
  Ban,
  Cancel,
  Cancel2,
  Folder,
  FolderOpen,
  Resize,
  GridView,
  ListView,
  Download,
  settings: SettingsGearIcon,
  settingsLines: SettingsLines,
  Backward,
  Forward,
  AddFile,
  AddFolder,
  Upload,
  Refresh,
  Copy,
  Cut,
  Paste,
  Trash,
  DeleteFolder,
  Layers,
  PaintPalette,
  Text,
  Cursor,
  SelectAll,
  Zip,
  UnZip,
  View,
  Outbox,
  Volume,
} as const;

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
