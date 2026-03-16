"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Check, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Folder as FolderType } from "@/lib/types";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  folders?: FolderType[];
}

export default function UploadModal({ open, onClose, onUploadComplete, folders = [] }: UploadModalProps) {
  const [uploaded, setUploaded] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [folderId, setFolderId] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploaded((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/markdown": [".md"],
      "text/html": [".html"],
    },
  });

  const handleClose = () => {
    setUploaded([]);
    setFolderId("");
    onClose();
  };

  const handleUpload = async () => {
    if (uploaded.length === 0) return;
    setUploading(true);
    try {
      await Promise.all(
        uploaded.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          if (folderId) formData.append("folderId", folderId);
          return fetch("/api/files", { method: "POST", body: formData });
        })
      );
      onUploadComplete();
      handleClose();
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Upload Documents</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-indigo-400 bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragActive ? "text-indigo-500" : "text-gray-400"}`} />
          {isDragActive ? (
            <p className="text-sm text-indigo-600 font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">Drag & drop files here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 mt-3 bg-gray-100 rounded-md px-3 py-1 inline-block">
                Supports .md and .html files
              </p>
            </>
          )}
        </div>

        {folders.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" /> Upload to folder
            </p>
            <select
              className="w-full text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
            >
              <option value="">Root (no folder)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        )}

        {uploaded.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">Files to upload</p>
            {uploaded.map((file, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg bg-gray-50">
                <div className="w-7 h-7 rounded bg-indigo-100 flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Check className="w-4 h-4 text-green-500 shrink-0" />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-1">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={uploading}>Cancel</Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={uploaded.length === 0 || uploading}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : `Upload${uploaded.length > 0 ? ` (${uploaded.length})` : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
