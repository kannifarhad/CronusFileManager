import config from "./Elements/config.json";
import mainconfig from "../Data/Config";
import { FileType, ImagesThumbTypeEnum, ItemsList, OrderByFieldEnum, OrderByType, SortByFieldEnum, ItemType } from "./types";

export const sortFilter = (filesList: ItemsList, order: OrderByType): ItemsList => {
  // Helper function to sort items based on the field and order
  const sortItems = (items: ItemsList, field: OrderByFieldEnum, orderBy: SortByFieldEnum): ItemsList => {
    return items.sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case OrderByFieldEnum.NAME:
          comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
          break;

        case OrderByFieldEnum.SIZE:
          comparison = a.size - b.size;
          break;

        case OrderByFieldEnum.DATE:
          comparison = new Date(a.created).getTime() - new Date(b.created).getTime();
          break;

        default:
          break;
      }
      return orderBy === SortByFieldEnum.ASC ? comparison : -comparison;
    });
  };

  // Separate folders and files, then sort each category
  const [folders, files] = filesList.reduce<[ItemsList, ItemsList]>((acc, item) => {
    if (item.type === ItemType.FOLDER) {
      acc[0].push(item);
    } else {
      acc[1].push(item);
    }
    return acc;
  }, [[], []]);

  const sortedFolders = sortItems(folders, order.field, order.orderBy);
  const sortedFiles = sortItems(files, order.field, order.orderBy);

  // Combine sorted folders and files
  return [...sortedFolders, ...sortedFiles];
};

export const checkSelectedFileType = (type: any, selectedFile: FileType) => {
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

export const getThumb = (item: FileType, showImages: ImagesThumbTypeEnum) => {
  try {
    if (showImages === ImagesThumbTypeEnum.THUMB && config.imageFiles.includes(item.extension)) {
      return `${mainconfig.serverPath}${item.path}`;
    } else {
      const extensionIconPath = config.icons[item.extension] || config.icons.broken;
      return  toAbsoluteUrl(extensionIconPath);
    }
  } catch (error) {
    return toAbsoluteUrl(config.icons.broken);
  }
};

/**
 * Formats a given number of bytes into a human-readable string.
 * 
 * @param bytes - The number of bytes.
 * @param decimals - The number of decimal places to include.
 * @returns A string representing the formatted size.
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === undefined || bytes === null) return '';

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedBytes = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));

  return `${formattedBytes} ${sizes[i]}`;
};

/**
 * Converts a date string to a human-readable format.
 * 
 * @param dateString - The date string to convert.
 * @returns A string representing the date and time in "dd/mm/yyyy hh:mm:ss" format.
 */
export const convertDate = (dateString: string): string => {
  const myDate = new Date(dateString);

  // Check if the date is invalid
  if (isNaN(myDate.getTime())) {
    return 'Invalid Date';
  }

  return `${myDate.toLocaleDateString("en-GB")} ${myDate.toLocaleTimeString("en-GB")}`;
};



const hasOwn = {}.hasOwnProperty;

type ClassValue = string | number | boolean | undefined | null | ClassDictionary | ClassArray;

interface ClassDictionary {
  [key: string]: any;
}

interface ClassArray extends Array<ClassValue> {}

export function classNames(...args: ClassValue[]): string {
  let classes = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg) {
      classes = appendClass(classes, parseValue(arg));
    }
  }

  return classes;
}

function parseValue(arg: ClassValue): string {
  if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
    return arg.toString();
  }

  if (typeof arg !== 'object' || arg === null) {
    return '';
  }

  if (Array.isArray(arg)) {
    return classNames(...arg);
  }

  if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
    return arg.toString();
  }

  let classes = '';

  for (const key in arg as ClassDictionary) {
    if (hasOwn.call(arg, key) && (arg as ClassDictionary)[key]) {
      classes = appendClass(classes, key);
    }
  }

  return classes;
}

function appendClass(value: string, newClass: string): string {
  if (!newClass) {
    return value;
  }

  return value ? (value + ' ' + newClass) : newClass;
}

