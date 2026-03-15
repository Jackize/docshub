"use client";

import { useState } from "react";
import { FileText, Upload, Github, Settings, LogOut, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocFile } from "@/lib/types";
import { mockFiles } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import UploadModal from "./UploadModal";
import { signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";

interface TopNavbarProps {
  user: Session["user"];
  onFileSelect: (file: DocFile) => void;
}

export default function TopNavbar({ user, onFileSelect }: TopNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  const results = query.trim()
    ? mockFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 gap-4 z-30 relative">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">DocsHub</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <div
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-9 bg-gray-50 cursor-text hover:border-gray-300 transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-400 flex-1">Search documentation...</span>
            <kbd className="text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400 font-mono">⌘K</kbd>
          </div>

          {/* Search dropdown */}
          {searchOpen && (
            <div className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="flex items-center gap-2 px-3 h-10 border-b border-gray-100">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  autoFocus
                  className="flex-1 text-sm outline-none bg-transparent"
                  placeholder="Search documentation..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={() => { setSearchOpen(false); setQuery(""); }}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              {query && (
                <div className="max-h-64 overflow-y-auto py-1">
                  {results.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No documents found</p>
                  ) : (
                    results.map((f) => (
                      <button
                        key={f.id}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                        onClick={() => { onFileSelect(f); setSearchOpen(false); setQuery(""); }}
                      >
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{f.name}</p>
                          <p className="text-xs text-gray-400">Updated {formatDate(f.updatedAt)}</p>
                        </div>
                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${f.type === "html" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                          {f.type}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => setUploadOpen(true)}>
            <Upload className="w-3.5 h-3.5" />
            Upload
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs text-gray-600">
            <Github className="w-3.5 h-3.5" />
            GitHub
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="w-4 h-4" />
          </Button>
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "User avatar"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full ml-1 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold ml-1">
              {user?.name
                ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                : "?"}
            </div>
          )}
        </div>
      </header>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

      {/* Backdrop for search */}
      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => { setSearchOpen(false); setQuery(""); }} />
      )}
    </>
  );
}
