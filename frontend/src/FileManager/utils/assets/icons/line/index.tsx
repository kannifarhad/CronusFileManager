import SettingsGearIcon from "./settingsGear.svg?react";
import SettingsLines from "./settingsLines.svg?react";
import Backward from "./backward.svg?react";
import Forward from "./forward.svg?react";
import AddFile from "./add.svg?react";
import AddFolder from "./addFolder.svg?react";
import Upload from "./upload.svg?react";
import Refresh from "./refresh.svg?react";
import Copy from "./copy.svg?react";
import Cut from "./cut.svg?react";
import Trash from "./trash.svg?react";
import Paste from "./paste.svg?react";
import DeleteFolder from "./delete-folder.svg?react";
import Layers from "./layers.svg?react";
import Text from "./text.svg?react";
import PaintPalette from "./paint-palette.svg?react";
import Cursor from "./cursor.svg?react";
import SelectAll from "./selectAll.svg?react";
import Zip from "./zip.svg?react";
import UnZip from "./unZip.svg?react";
import View from "./view.svg?react";
import Information from "./information.svg?react";
import Outbox from "./outbox.svg?react";
import Download from "./download.svg?react";
import GridView from "./gridView.svg?react";
import ListView from "./listView.svg?react";
import Resize from "./resize.svg?react";
import Folder from "./folder.svg?react";
import FolderOpen from "./folderOpen.svg?react";
import Cancel from "./cancel.svg?react";
import Cancel2 from "./cancel-1.svg?react";
import Ban from "./ban.svg?react";
import Next from "./next.svg?react";
import Save from "./save.svg?react";
import Exit from "./exit.svg?react";
import Pencil from "./pencil.svg?react";
import Search from "./loupe.svg?react";
import Volume from "./vol3.svg?react";

// Map of all icon components
export const iconMap = {
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
