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
  shareToken?: string | null;
}

export interface VersionEntry {
  version: number;
  date: Date;
  author: string;
  summary: string;
  content: string;
}

export interface StoredVersionEntry {
  version: number;
  date: string;
  author: string;
  summary: string;
  chunkPath: string;
}

export interface StoredDocFile {
  id: string;
  name: string;
  type: FileType;
  version: number;
  updatedAt: string;
  author: string;
  folderId: string | null;
  history: StoredVersionEntry[];
  breadcrumb?: string[];
  chunkPath: string;
  shareToken?: string | null;
}

export interface ReceivedShare {
  token: string;
  ownerEmail: string;
  fileId: string;
  fileName: string;
  sharedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}
