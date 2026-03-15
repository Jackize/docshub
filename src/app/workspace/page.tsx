"use client";

import { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { DocFile } from "@/lib/types";
import { mockFiles } from "@/lib/mock-data";

export default function WorkspacePage() {
  const [selectedFile, setSelectedFile] = useState<DocFile>(mockFiles[3]); // default to API auth guide

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <TopNavbar onFileSelect={setSelectedFile} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedFileId={selectedFile?.id ?? null} onFileSelect={setSelectedFile} />
        <MainContent file={selectedFile} />
      </div>
    </div>
  );
}
