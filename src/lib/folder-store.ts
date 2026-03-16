import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Folder } from "@/lib/types";

function userDir(userId: string): string {
  return path.join(process.cwd(), "uploads", userId);
}

function foldersPath(userId: string): string {
  return path.join(userDir(userId), "folders.json");
}

function readRaw(userId: string): Folder[] {
  const p = foldersPath(userId);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8")) as Folder[];
}

function writeRaw(userId: string, folders: Folder[]): void {
  const dir = userDir(userId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(foldersPath(userId), JSON.stringify(folders, null, 2), "utf-8");
}

export function getUserFolders(userId: string): Folder[] {
  return readRaw(userId);
}

export function createFolder(userId: string, name: string, parentId: string | null): Folder {
  const folder: Folder = { id: randomUUID(), name, parentId };
  const folders = readRaw(userId);
  folders.push(folder);
  writeRaw(userId, folders);
  return folder;
}

export function renameFolder(userId: string, id: string, newName: string): Folder | null {
  const folders = readRaw(userId);
  const idx = folders.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  folders[idx] = { ...folders[idx], name: newName };
  writeRaw(userId, folders);
  return folders[idx];
}

// Collects all descendant folder ids (not including the root id itself)
function collectDescendants(id: string, allFolders: Folder[]): string[] {
  const children = allFolders.filter((f) => f.parentId === id);
  return children.flatMap((c) => [c.id, ...collectDescendants(c.id, allFolders)]);
}

export function deleteFolder(userId: string, id: string): string[] {
  const folders = readRaw(userId);
  const toRemove = new Set([id, ...collectDescendants(id, folders)]);

  // Read files.json and move affected files to root
  const filesPath = path.join(userDir(userId), "files.json");
  const movedFileIds: string[] = [];
  if (fs.existsSync(filesPath)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files: any[] = JSON.parse(fs.readFileSync(filesPath, "utf-8"));
    let changed = false;
    for (const file of files) {
      if (file.folderId && toRemove.has(file.folderId)) {
        file.folderId = null;
        movedFileIds.push(file.id);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filesPath, JSON.stringify(files, null, 2), "utf-8");
    }
  }

  writeRaw(userId, folders.filter((f) => !toRemove.has(f.id)));
  return movedFileIds;
}
