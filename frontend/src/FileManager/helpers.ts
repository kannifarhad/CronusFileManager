import { FILE_EXTENSION_MAP } from "./config";
import { OrderByFieldEnum, SortByFieldEnum, ItemType, ItemExtensionCategoryFilter } from "./types";
import type { FileType, ItemsList, OrderByType, FolderType, FolderList } from "./types";

export const sortFilter = (filesList: ItemsList, order: OrderByType): ItemsList => {
  // Helper function to sort items based on the field and order
  const sortItems = (items: ItemsList, field: OrderByFieldEnum, orderBy: SortByFieldEnum): ItemsList =>
    items.sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case OrderByFieldEnum.NAME:
          comparison = a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
          });
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

  // Separate folders and files, then sort each category
  const [folders, files] = filesList.reduce<[ItemsList, ItemsList]>(
    (acc, item) => {
      if (item.type === ItemType.FOLDER) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }
      return acc;
    },
    [[], []]
  );

  const sortedFolders = sortItems(folders, order.field, order.orderBy);
  const sortedFiles = sortItems(files, order.field, order.orderBy);

  // Combine sorted folders and files
  return [...sortedFolders, ...sortedFiles];
};

// Function to add folders to the folder tree based on the path
export function addFoldersToTree(folderTreeState: FolderList | null, foldersArray: FolderType[]): FolderList | null {
  if (!folderTreeState) return null;
  const folderTree = { ...folderTreeState };
  // Helper function to find or create the parent folder where the new folder should be added
  function findParentFolder(tree: FolderList, path: string) {
    // If the path is the root path, return the tree itself
    if (path === "/") return tree;

    // Split the path into parts
    const parts = path.split("/").filter(Boolean);
    let currentNode = tree;

    // Traverse through the tree to find or create the parent node
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Check if currentNode has children
      if (!currentNode.children) currentNode.children = [];

      // Find the next node in the path by matching 'name'
      const foundNode = currentNode.children.find((child) => child.name === part);

      if (foundNode) {
        currentNode = foundNode;
      } else {
        // If part of the path is not found, create a new folder node
        const newNode = {
          path: `${currentNode.path}${part}/`,
          name: part,
          created: "",
          modified: "",
          id: `${currentNode.path}${part}/${Date.now()}`, // create unique id
          type: ItemType.FOLDER,
          children: [],
          size: 0,
          private: false,
        } as FolderList;
        currentNode.children.push(newNode);
        currentNode = newNode;
      }
    }

    return currentNode;
  }

  // Iterate through each folder in the array
  foldersArray.forEach((folder: FolderType) => {
    // Get the parent path by removing the last segment
    const trimmedPath = folder.path.endsWith("/") ? folder.path.slice(0, -1) : folder.path;

    // Get the parent path by removing the last segment
    const parentPath = `${trimmedPath.split("/").slice(0, -1).join("/")}/`;

    // Find the parent folder node in the tree
    const parentFolder = findParentFolder(folderTree, parentPath);

    // Check if folder already exists in the parent's children using 'path' or 'name'
    let existingFolder = parentFolder?.children?.find((child: any) => child.path === folder.path);

    // If no existing folder, add it as a new child
    if (!existingFolder) {
      parentFolder!.children!.push(folder as FolderList);
    } else {
      // If folder exists, update its properties if needed (e.g., 'name', 'created', etc.)
      existingFolder = { ...existingFolder, ...folder } as FolderList;
    }
  });
  return folderTree;
}

export const checkSelectedFileType = (type: ItemExtensionCategoryFilter, selectedFile: FileType) => {
  try {
    switch (type) {
      case ItemExtensionCategoryFilter.FILE:
        return selectedFile.type === ItemType.FILE;

      case ItemExtensionCategoryFilter.TEXT:
        return FILE_EXTENSION_MAP.textFiles.includes(selectedFile.extension);
      case ItemExtensionCategoryFilter.ARCHIVE:
        return FILE_EXTENSION_MAP.archiveFiles.includes(selectedFile.extension);

      case ItemExtensionCategoryFilter.IMAGE:
        return FILE_EXTENSION_MAP.imageFiles.includes(selectedFile.extension);

      default:
        return false;
    }
  } catch (error) {
    return false;
  }
};

export const toAbsoluteUrl = (pathname: string) => import.meta.env.PUBLIC_URL + pathname;

export const getFileExtensionIcon = (extension: keyof typeof FILE_EXTENSION_MAP.icons) => {
  const extensionIconPath = FILE_EXTENSION_MAP.icons[extension] || FILE_EXTENSION_MAP.icons.broken;
  return toAbsoluteUrl(extensionIconPath);
};

export const getFileIcon = (item: FileType) => {
  try {
    return getFileExtensionIcon(item.extension);
  } catch (error) {
    return toAbsoluteUrl(FILE_EXTENSION_MAP.icons.broken);
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
  if (bytes === undefined || bytes === null) return "";

  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedBytes = parseFloat((bytes / k ** i).toFixed(decimals));

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
  if (Number.isNaN(myDate.getTime())) {
    return "Invalid Date";
  }

  return `${myDate.toLocaleDateString("en-GB")} ${myDate.toLocaleTimeString("en-GB")}`;
};

const hasOwn = {}.hasOwnProperty;

interface ClassDictionary {
  [key: string]: any;
}
type ClassValue = string | number | boolean | undefined | null | ClassDictionary | ClassArray;

interface ClassArray extends Array<ClassValue> {}

export function classNames(...args: ClassValue[]): string {
  let classes = "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg) {
      classes = appendClass(classes, parseValue(arg));
    }
  }

  return classes;
}

function parseValue(arg: ClassValue): string {
  if (typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") {
    return arg.toString();
  }

  if (typeof arg !== "object" || arg === null) {
    return "";
  }

  if (Array.isArray(arg)) {
    return classNames(...arg);
  }

  if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
    return arg.toString();
  }

  let classes = "";

  // eslint-disable-next-line no-restricted-syntax
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

  return value ? `${value} ${newClass}` : newClass;
}

// DROPZONE HELPERS
export interface DroppedFile {
  path: string;
  preview: string;
  index: number;
  type?: ItemType.FILE;
  size?: number;
  name?: string;
}

export interface DroppedFolder {
  name: string;
  index: number;
  type: ItemType.FOLDER;
  size?: number;
  children: (DroppedFolder | DroppedFile)[];
}

export type DroppedFilesTree = (DroppedFolder | DroppedFile)[];
// Helper function to create folder trees
function addFileToTree(tree: DroppedFilesTree, file: DroppedFile): void {
  const parts = file.path.split("/").filter(Boolean); // Split the path and remove empty parts
  let currentFolder = tree;

  parts.forEach((part, index) => {
    const isFile = index === parts.length - 1;

    if (isFile) {
      // If it's the file, add it to the folder with 'type' attribute
      currentFolder.push({
        ...file,
        type: ItemType.FILE,
      });
    } else {
      // Check if the folder already exists
      let folder = currentFolder.find(
        (item) => "name" in item && item.name === part && item.type === ItemType.FOLDER
      ) as DroppedFolder | undefined;

      // If folder doesn't exist, create it
      if (!folder) {
        folder = {
          name: part,
          index: file.index,
          type: ItemType.FOLDER,
          children: [],
          size: 0,
        };
        currentFolder.unshift(folder);
      }

      // Move deeper into the folder structure
      currentFolder = folder.children;
    }
  });
}

// Main function to organize files into folders and subfolders
export function organizeFiles(files: DroppedFile[]): (DroppedFolder | DroppedFile)[] {
  const tree: (DroppedFolder | DroppedFile)[] = [];

  files.forEach((file, index) => {
    if (file.path.includes("/")) {
      // If the file has a folder path, process it
      addFileToTree(tree, { ...file, index, size: file.size, name: file.name });
    } else {
      // If no folder path, add it directly to root
      tree.push({
        ...file,
        index,
        type: ItemType.FILE,
        size: file.size,
        name: file.name,
      });
    }
  });

  return tree;
}

export function writeJsonToLocalStorage(key: string, data: any): void {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error writing JSON to localStorage:", error);
  }
}

export function readJsonFromLocalStorage<T>(key: string): T | null {
  try {
    const jsonData = localStorage.getItem(key);
    if (jsonData) {
      return JSON.parse(jsonData) as T;
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error reading JSON from localStorage:", error);
    return null;
  }
}

export const wasMultiSelectKeyUsed = (event: MouseEvent | KeyboardEvent) => event.shiftKey;
