import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { ReceivedShare } from "@/lib/types";
import { setShareToken, getUserFiles } from "@/lib/file-store";

type ShareIndex = Record<string, { ownerEmail: string; fileId: string }>;

function uploadsDir(): string {
  return path.join(process.cwd(), "uploads");
}

function shareIndexPath(): string {
  return path.join(uploadsDir(), "_share_index.json");
}

function receivedSharesPath(email: string): string {
  return path.join(uploadsDir(), email, "received_shares.json");
}

function readShareIndex(): ShareIndex {
  const p = shareIndexPath();
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, "utf-8")) as ShareIndex;
}

function writeShareIndex(index: ShareIndex): void {
  fs.mkdirSync(uploadsDir(), { recursive: true });
  fs.writeFileSync(shareIndexPath(), JSON.stringify(index, null, 2), "utf-8");
}

export function generateShare(ownerEmail: string, fileId: string): string {
  const token = randomUUID();
  setShareToken(ownerEmail, fileId, token);
  const index = readShareIndex();
  index[token] = { ownerEmail, fileId };
  writeShareIndex(index);
  return token;
}

export function revokeShare(ownerEmail: string, fileId: string): void {
  const files = getUserFiles(ownerEmail);
  const file = files.find((f) => f.id === fileId);
  if (!file?.shareToken) return;
  const token = file.shareToken;
  setShareToken(ownerEmail, fileId, null);
  const index = readShareIndex();
  delete index[token];
  writeShareIndex(index);
}

export function resolveToken(token: string): { ownerEmail: string; fileId: string } | null {
  const index = readShareIndex();
  return index[token] ?? null;
}

export function addReceivedShare(recipientEmail: string, share: ReceivedShare): void {
  const p = receivedSharesPath(recipientEmail);
  const dir = path.dirname(p);
  fs.mkdirSync(dir, { recursive: true });
  const existing: ReceivedShare[] = fs.existsSync(p)
    ? (JSON.parse(fs.readFileSync(p, "utf-8")) as ReceivedShare[])
    : [];
  if (existing.some((s) => s.token === share.token)) return;
  existing.push(share);
  fs.writeFileSync(p, JSON.stringify(existing, null, 2), "utf-8");
}

export function getReceivedShares(recipientEmail: string): ReceivedShare[] {
  const p = receivedSharesPath(recipientEmail);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8")) as ReceivedShare[];
}

export function removeReceivedShare(recipientEmail: string, token: string): void {
  const p = receivedSharesPath(recipientEmail);
  if (!fs.existsSync(p)) return;
  const existing: ReceivedShare[] = JSON.parse(fs.readFileSync(p, "utf-8"));
  fs.writeFileSync(p, JSON.stringify(existing.filter((s) => s.token !== token), null, 2), "utf-8");
}
