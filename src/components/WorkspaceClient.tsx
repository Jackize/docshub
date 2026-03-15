"use client";

import { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { DocFile } from "@/lib/types";
import { mockFiles } from "@/lib/mock-data";
import type { Session } from "next-auth";

interface WorkspaceClientProps {
  user: Session["user"];
}

export default function WorkspaceClient({ user }: WorkspaceClientProps) {
  const [selectedFile, setSelectedFile] = useState<DocFile>(mockFiles[3]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <TopNavbar user={user} onFileSelect={setSelectedFile} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedFileId={selectedFile?.id ?? null} onFileSelect={setSelectedFile} />
        <MainContent file={selectedFile} />
      </div>
    </div>
  );
}
