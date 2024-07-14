import config from "./Elements/config.json";
import mainconfig from "../Data/Config";

interface File {
  fileName: string; // Renamed from 'name'
  size: number;
  created: string;
}

interface Order {
  field: string;
  orderBy: string;
}
interface Item {
  extension: string;
  path: string;
}

export const sortFilter = (filesList: File[], order: Order): File[] => {
  let sortedFiles: File[] = [];

  switch (order.field) {
    case "name":
      sortedFiles = filesList.sort((a, b) => {
        const x = a.fileName?.toLowerCase(); // Changed from 'name'
        const y = b.fileName?.toLowerCase(); // Changed from 'name'
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      break;

    case "size":
      sortedFiles = filesList.sort((a, b) => a.size - b.size);
      break;

    case "date":
      sortedFiles = filesList.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
      break;

    default:
      sortedFiles = filesList;
      break;
  }

  return order.orderBy === "asc" ? sortedFiles : sortedFiles.reverse();
};

export const checkSelectedFileType = (type: any, selectedFile: any) => {
  try {
    switch (type) {
      case "text":
        return config.textFiles.includes(selectedFile.extension);
      case "archive":
        return config.archiveFiles.includes(selectedFile.extension);

      case "image":
        return config.imageFiles.includes(selectedFile.extension);

      default:
        return false;
    }
  } catch (error) {
    return false;
  }
};

export const toAbsoluteUrl = (pathname: string) =>
  process.env.PUBLIC_URL + pathname;

export const getThumb = (item: Item, showImages: string) => {
  try {
    if (showImages === "thumbs" && config.imageFiles.includes(item.extension)) {
      return `${mainconfig.serverPath}${item.path}`;
    } else {
      // const extensionIconPath = config.icons[item.extension] || config.icons.broken;
      const extensionIconPath = config.icons.broken;
      return  toAbsoluteUrl(extensionIconPath);
    }
  } catch (error) {
    return toAbsoluteUrl(config.icons.broken);
  }
};
