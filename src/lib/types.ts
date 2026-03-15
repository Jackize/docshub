export type FileType = "md" | "html";

export interface DocFile {
  id: string;
  name: string;
  type: FileType;
  content: string;
  version: number;
  updatedAt: Date;
  author: string;
  folderId: string | null;
  history: VersionEntry[];
  breadcrumb?: string[];
}

export interface VersionEntry {
  version: number;
  date: Date;
  author: string;
  summary: string;
  content: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}
