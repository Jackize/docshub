"use client";

import MarkdownPreview from "@/components/MarkdownPreview";
import { DocFile } from "@/lib/types";

export default function SharedFileContent({ file }: { file: DocFile }) {
  return <MarkdownPreview file={file} />;
}
