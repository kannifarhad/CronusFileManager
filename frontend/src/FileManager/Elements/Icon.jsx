/* eslint-disable react/prop-types */
import React from "react";
import { ReactComponent as SettingsGearIcon } from "../Assets/Icons/settingsGear.svg";
import { ReactComponent as SettingsLines } from "../Assets/Icons/settingsLines.svg";
import { ReactComponent as Backward } from "../Assets/Icons/backward.svg";
import { ReactComponent as Forward } from "../Assets/Icons/forward.svg";
import { ReactComponent as AddFile } from "../Assets/Icons/add.svg";
import { ReactComponent as AddFolder } from "../Assets/Icons/addFolder.svg";
import { ReactComponent as Upload } from "../Assets/Icons/upload.svg";
import { ReactComponent as Refresh } from "../Assets/Icons/refresh.svg";
import { ReactComponent as Copy } from "../Assets/Icons/copy.svg";
import { ReactComponent as Cut } from "../Assets/Icons/cut.svg";
import { ReactComponent as Trash } from "../Assets/Icons/trash.svg";
import { ReactComponent as Paste } from "../Assets/Icons/paste.svg";
import { ReactComponent as DeleteFolder } from "../Assets/Icons/delete-folder.svg";
import { ReactComponent as Layers } from "../Assets/Icons/layers.svg";
import { ReactComponent as Text } from "../Assets/Icons/text.svg";
import { ReactComponent as PaintPalette } from "../Assets/Icons/paint-palette.svg";
import { ReactComponent as Cursor } from "../Assets/Icons/cursor.svg";
import { ReactComponent as SelectAll } from "../Assets/Icons/selectAll.svg";
import { ReactComponent as Zip } from "../Assets/Icons/zip.svg";
import { ReactComponent as UnZip } from "../Assets/Icons/unZip.svg";
import { ReactComponent as View } from "../Assets/Icons/view.svg";
import { ReactComponent as Information } from "../Assets/Icons/information.svg";
import { ReactComponent as Outbox } from "../Assets/Icons/outbox.svg";
import { ReactComponent as Download } from "../Assets/Icons/download.svg";
import { ReactComponent as GridView } from "../Assets/Icons/gridView.svg";
import { ReactComponent as ListView } from "../Assets/Icons/listView.svg";
import { ReactComponent as Resize } from "../Assets/Icons/resize.svg";
import { ReactComponent as Folder } from "../Assets/Icons/folder.svg";
import { ReactComponent as FolderOpen } from "../Assets/Icons/folderOpen.svg";
import { ReactComponent as Cancel } from "../Assets/Icons/cancel.svg";
import { ReactComponent as Cancel2 } from "../Assets/Icons/cancel-1.svg";
import { ReactComponent as Ban } from "../Assets/Icons/ban.svg";
import { ReactComponent as Next } from "../Assets/Icons/next.svg";
import { ReactComponent as Save } from "../Assets/Icons/save.svg";
import { ReactComponent as Exit } from "../Assets/Icons/exit.svg";
import { ReactComponent as Pencil } from "../Assets/Icons/pencil.svg";
import { ReactComponent as Search } from "../Assets/Icons/loupe.svg";
import { ReactComponent as Volume } from "../Assets/Icons/volume.svg";

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
};

const Icon = ({ name, color = "#ccc", size = 15, ...rest }) => {
  // Get the corresponding SVG component from the iconMap
  const SelectedIcon = iconMap[name];

  // Ensure SelectedIcon exists
  if (!SelectedIcon) {
    // eslint-disable-next-line no-console
    console.warn("couldnt found an icon with name", name);
    return null;
  }

  // Render the selected icon with customizable color and size
  return <SelectedIcon width={size} height={size} fill={color} {...rest} />;
};

export default Icon;
