export const ENTITY_CONST = {
  DIRECTORY: "folder",
  FILE: "file",
} as const;

export type EntityType = (typeof ENTITY_CONST)[keyof typeof ENTITY_CONST];

export interface FSItem {
  id: string;
  name: string;
  created: Date;
  modified: Date;
  path: string;
  premissions: FSPermissions;
  type: EntityType;
  size?: number;
  extension?: string;
  children?: FSItem[];
}

export interface DirectoryTreeOptions {
  exclude?: RegExp | RegExp[];
  includeFiles?: boolean;
  extensions?: RegExp;
  normalizePath?: boolean;
  removePath?: string;
  attributes?: string[];
  withChildren?: boolean;
  childrenDepth?: number
}

export interface FSPermissions {
  owner: string;
  group: string;
  others: string;
}
