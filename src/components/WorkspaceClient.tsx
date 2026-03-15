"use client";

import { useState, useEffect, useCallback } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { DocFile } from "@/lib/types";
import type { Session } from "next-auth";

interface WorkspaceClientProps {
  user: Session["user"];
}

function parseDates(file: DocFile): DocFile {
  return {
    ...file,
    updatedAt: new Date(file.updatedAt),
    history: (file.history ?? []).map((h) => ({ ...h, date: new Date(h.date) })),
  };
}

export default function WorkspaceClient({ user }: WorkspaceClientProps) {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocFile | null>(null);

  const refreshFiles = useCallback(async () => {
    const res = await fetch("/api/files");
    if (res.ok) {
      const data: DocFile[] = await res.json();
      const parsed = data.map(parseDates);
      setFiles(parsed);
      setSelectedFile((prev) => {
        if (prev) {
          const updated = parsed.find((f) => f.id === prev.id);
          return updated ?? (parsed.length > 0 ? parsed[0] : null);
        }
        return parsed.length > 0 ? parsed[0] : null;
      });
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const handleDeleteFile = useCallback(async (id: string) => {
    await fetch(`/api/files/${id}`, { method: "DELETE" });
    await refreshFiles();
    setSelectedFile((prev) => (prev?.id === id ? null : prev));
  }, [refreshFiles]);

  const handleSaveFile = useCallback(async (id: string, content: string) => {
    const res = await fetch(`/api/files/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const updated = parseDates(await res.json() as DocFile);
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
      setSelectedFile((prev) => (prev?.id === id ? updated : prev));
    }
  }, []);

  const handleRestoreFile = useCallback(async (id: string, version: number) => {
    const res = await fetch(`/api/files/${id}/rollback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version }),
    });
    if (res.ok) {
      const updated = parseDates(await res.json() as DocFile);
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
      setSelectedFile((prev) => (prev?.id === id ? updated : prev));
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <TopNavbar
        user={user}
        files={files}
        onFileSelect={setSelectedFile}
        onUploadComplete={refreshFiles}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          files={files}
          folders={[]}
          selectedFileId={selectedFile?.id ?? null}
          onFileSelect={setSelectedFile}
        />
        <MainContent
          file={selectedFile}
          onDeleteFile={handleDeleteFile}
          onSaveFile={handleSaveFile}
          onRestoreFile={handleRestoreFile}
        />
      </div>
    </div>
  );
}
