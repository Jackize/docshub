import Link from "next/link";
import { auth } from "@/auth";
import { resolveToken, addReceivedShare } from "@/lib/share-store";
import { getUserFiles } from "@/lib/file-store";
import SharedFileContent from "./SharedFileContent";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharedFilePage({ params }: Props) {
  const { token } = await params;

  const resolved = resolveToken(token);
  if (!resolved) {
    return <ErrorPage title="Link not found" message="This share link is invalid or has been revoked." />;
  }

  const { ownerEmail, fileId } = resolved;
  const files = getUserFiles(ownerEmail);
  const file = files.find((f) => f.id === fileId);

  if (!file) {
    return <ErrorPage title="File deleted" message="This file has been deleted by the owner." />;
  }

  const session = await auth();
  const recipientEmail = session?.user?.email;

  if (recipientEmail && recipientEmail !== ownerEmail) {
    addReceivedShare(recipientEmail, {
      token,
      ownerEmail,
      fileId,
      fileName: file.name,
      sharedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="font-semibold text-gray-900">DocsHub</span>
        </Link>
        {!session?.user ? (
          <Link
            href="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
          >
            Sign in
          </Link>
        ) : (
          <span className="text-sm text-gray-500">{session.user.email}</span>
        )}
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{file.name}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Shared by {ownerEmail}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                file.type === "html"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              {file.type === "html" ? "HTML" : "Markdown"}
            </span>
          </div>
          <div className="px-8 py-6">
            <SharedFileContent file={file} />
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/workspace" className="text-sm text-indigo-600 hover:text-indigo-700">
            Open DocsHub →
          </Link>
        </div>
      </main>
    </div>
  );
}

function ErrorPage({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="font-semibold text-gray-900">DocsHub</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500">{message}</p>
          <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
