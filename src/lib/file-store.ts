import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { DocFile, StoredDocFile, StoredVersionEntry } from "@/lib/types";

function userDir(userId: string): string {
  return path.join(process.cwd(), "uploads", userId);
}

function filesPath(userId: string): string {
  return path.join(userDir(userId), "files.json");
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function chunkRelPath(folderName: string, version: number, type: string): string {
  return path.join(folderName, `v${version}.${type}`);
}

function resolveChunk(userId: string, rel: string): string {
  return path.join(userDir(userId), rel);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hydrate(userId: string, s: any): DocFile {
  // Support legacy records that stored content inline (no chunkPath)
  const currentContent = s.chunkPath
    ? fs.readFileSync(resolveChunk(userId, s.chunkPath), "utf-8")
    : (s.content ?? "");

  const history = ((s.history ?? []) as StoredVersionEntry[]).map((h) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legacy = h as any;
    const hContent = h.chunkPath
      ? fs.readFileSync(resolveChunk(userId, h.chunkPath), "utf-8")
      : (legacy.content ?? "");
    return {
      version: h.version,
      date: new Date(h.date),
      author: h.author,
      summary: h.summary,
      content: hContent,
    };
  });

  return {
    id: s.id,
    name: s.name,
    type: s.type,
    version: s.version,
    updatedAt: new Date(s.updatedAt),
    author: s.author,
    folderId: s.folderId,
    breadcrumb: s.breadcrumb,
    content: currentContent,
    history,
    shareToken: s.shareToken ?? null,
  };
}

function readRaw(userId: string): StoredDocFile[] {
  const p = filesPath(userId);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8")) as StoredDocFile[];
}

function writeRaw(userId: string, files: StoredDocFile[]): void {
  const dir = userDir(userId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filesPath(userId), JSON.stringify(files, null, 2), "utf-8");
}

export function getUserFiles(userId: string): DocFile[] {
  return readRaw(userId).map((s) => hydrate(userId, s));
}

export function saveFile(userId: string, file: Omit<DocFile, "id">): DocFile {
  const id = randomUUID();
  const version = file.version ?? 1;
  const folderName = sanitizeName(file.name);
  const rel = chunkRelPath(folderName, version, file.type);

  fs.mkdirSync(path.join(userDir(userId), folderName), { recursive: true });
  fs.writeFileSync(resolveChunk(userId, rel), file.content, "utf-8");

  const stored: StoredDocFile = {
    id,
    name: file.name,
    type: file.type,
    version,
    updatedAt: file.updatedAt instanceof Date ? file.updatedAt.toISOString() : String(file.updatedAt),
    author: file.author,
    folderId: file.folderId,
    history: [],
    breadcrumb: file.breadcrumb,
    chunkPath: rel,
  };

  const files = readRaw(userId);
  files.push(stored);
  writeRaw(userId, files);

  return hydrate(userId, stored);
}

export function updateFile(
  userId: string,
  id: string,
  patch: { content: string }
): DocFile | null {
  const files = readRaw(userId);
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return null;

  const existing = files[idx];
  const newVersion = existing.version + 1;
  const folderName = sanitizeName(existing.name);
  const newRel = chunkRelPath(folderName, newVersion, existing.type);

  fs.writeFileSync(resolveChunk(userId, newRel), patch.content, "utf-8");

  const historyEntry: StoredVersionEntry = {
    version: existing.version,
    date: existing.updatedAt,
    author: existing.author,
    summary: `Version ${existing.version}`,
    chunkPath: existing.chunkPath,
  };

  const updated: StoredDocFile = {
    ...existing,
    version: newVersion,
    updatedAt: new Date().toISOString(),
    chunkPath: newRel,
    history: [...existing.history, historyEntry],
  };

  files[idx] = updated;
  writeRaw(userId, files);

  return hydrate(userId, updated);
}

export function setShareToken(userId: string, fileId: string, token: string | null): void {
  const files = readRaw(userId);
  const idx = files.findIndex((f) => f.id === fileId);
  if (idx === -1) return;
  files[idx] = { ...files[idx], shareToken: token };
  writeRaw(userId, files);
}

export function deleteFile(userId: string, id: string): boolean {
  const files = readRaw(userId);
  const target = files.find((f) => f.id === id);
  if (!target) return false;

  // Revoke share if active
  if (target.shareToken) {
    // Import lazily to avoid circular deps
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { revokeShare } = require("@/lib/share-store") as typeof import("@/lib/share-store");
    revokeShare(userId, id);
  }

  // Derive folder from chunkPath (e.g. "CLAUDE/v1.md" → "CLAUDE")
  if (target.chunkPath) {
    const folderName = path.dirname(target.chunkPath);
    fs.rmSync(path.join(userDir(userId), folderName), { recursive: true, force: true });
  }

  writeRaw(userId, files.filter((f) => f.id !== id));
  return true;
}

export function renameFile(userId: string, id: string, newName: string): DocFile | null {
  const files = readRaw(userId);
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return null;

  const existing = files[idx];
  const newSanitized = sanitizeName(newName);

  // Collision check
  if (files.some((f) => f.id !== id && sanitizeName(f.name) === newSanitized)) {
    return null;
  }

  const oldSanitized = sanitizeName(existing.name);
  const oldDir = path.join(userDir(userId), oldSanitized);
  const newDir = path.join(userDir(userId), newSanitized);

  if (fs.existsSync(oldDir)) {
    fs.renameSync(oldDir, newDir);
  }

  // Determine new type from extension if provided, else keep old
  const ext = newName.split(".").pop()?.toLowerCase();
  const newType = ext === "html" ? "html" : existing.type;

  // Rewrite chunkPaths
  const rewrite = (p: string) => {
    if (p.startsWith(oldSanitized + "/") || p.startsWith(oldSanitized + "\\")) {
      return newSanitized + p.slice(oldSanitized.length);
    }
    return p;
  };

  const updated: StoredDocFile = {
    ...existing,
    name: newName,
    type: newType,
    chunkPath: rewrite(existing.chunkPath),
    history: existing.history.map((h) => ({ ...h, chunkPath: rewrite(h.chunkPath) })),
  };

  files[idx] = updated;
  writeRaw(userId, files);
  return hydrate(userId, updated);
}

export function patchFileMeta(
  userId: string,
  id: string,
  patch: { name?: string; folderId?: string | null }
): DocFile | null {
  if (patch.name !== undefined) {
    return renameFile(userId, id, patch.name);
  }

  const files = readRaw(userId);
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return null;

  const updated: StoredDocFile = { ...files[idx], folderId: patch.folderId ?? null };
  files[idx] = updated;
  writeRaw(userId, files);
  return hydrate(userId, updated);
}

export function rollbackFile(
  userId: string,
  fileId: string,
  targetVersion: number
): DocFile | null {
  const files = readRaw(userId);
  const idx = files.findIndex((f) => f.id === fileId);
  if (idx === -1) return null;

  const existing = files[idx];
  const historyEntry = existing.history.find((h) => h.version === targetVersion);
  if (!historyEntry) return null;

  const restoredContent = fs.readFileSync(resolveChunk(userId, historyEntry.chunkPath), "utf-8");
  const newVersion = existing.version + 1;
  const folderName = sanitizeName(existing.name);
  const newRel = chunkRelPath(folderName, newVersion, existing.type);

  fs.writeFileSync(resolveChunk(userId, newRel), restoredContent, "utf-8");

  const archiveEntry: StoredVersionEntry = {
    version: existing.version,
    date: existing.updatedAt,
    author: existing.author,
    summary: `Version ${existing.version}`,
    chunkPath: existing.chunkPath,
  };

  const updated: StoredDocFile = {
    ...existing,
    version: newVersion,
    updatedAt: new Date().toISOString(),
    chunkPath: newRel,
    history: [...existing.history, archiveEntry],
  };

  files[idx] = updated;
  writeRaw(userId, files);

  return hydrate(userId, updated);
}
