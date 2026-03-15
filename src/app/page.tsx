import Link from "next/link";
import {
  FileText,
  Upload,
  Eye,
  History,
  Folder,
  GitBranch,
  Lock,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: Lock, title: "OAuth Login", desc: "Secure sign-in with Google or GitHub." },
  { icon: Upload, title: "File Upload", desc: "Drag & drop .md and .html files effortlessly." },
  { icon: Eye, title: "Markdown & HTML Preview", desc: "Beautiful rendered previews for all your docs." },
  { icon: History, title: "Version History", desc: "Track every change like a Git commit log." },
  { icon: Folder, title: "Folder Organization", desc: "Organize documents in nested folder trees." },
  { icon: GitBranch, title: "Git-like History", desc: "Compare, restore, and audit document versions." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="border-b border-gray-100 h-14 flex items-center px-8 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">DocsHub</span>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg px-3 h-8 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Login
          </Link>
          <Link href="/workspace" className="inline-flex items-center justify-center rounded-lg px-3 h-8 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
          Now with live Markdown preview
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
          A modern documentation<br />workspace for teams.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Upload, organize, preview, and version your markdown and HTML documents — all in one clean interface.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/workspace" className="inline-flex items-center justify-center gap-2 rounded-lg px-5 h-11 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-5 h-11 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Login
          </Link>
        </div>
      </section>

      {/* App preview */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/80 overflow-hidden">
          <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 mx-6 h-5 bg-white rounded border border-gray-200" />
          </div>
          <div className="flex h-64 bg-white">
            <div className="w-52 border-r border-gray-100 p-3 space-y-1.5">
              <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-7 bg-gray-50 border border-gray-100 rounded-md flex items-center px-2 gap-2">
                  <div className="w-4 h-4 bg-orange-100 rounded shrink-0" />
                  <div className="h-2 bg-gray-200 rounded flex-1" />
                  <div className="w-8 h-4 bg-orange-100 rounded text-[8px] text-orange-600 font-bold flex items-center justify-center">HTML</div>
                </div>
              ))}
            </div>
            <div className="flex-1 p-6">
              <div className="h-3 w-64 bg-gray-100 rounded mb-5" />
              <div className="flex gap-2 mb-5">
                <div className="h-5 w-20 bg-purple-100 rounded-full" />
                <div className="h-5 w-10 bg-indigo-100 rounded-full" />
                <div className="h-5 w-32 bg-gray-100 rounded-full" />
              </div>
              <div className="h-7 w-72 bg-gray-800 rounded mb-4" />
              <div className="space-y-2">
                {[80, 100, 90, 70, 95].map((w, i) => (
                  <div key={i} className="h-2.5 bg-gray-100 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything you need to manage docs</h2>
        <div className="grid grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border border-gray-100 rounded-xl p-5 hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Manage your documentation like a developer.</h2>
        <p className="text-gray-400 text-sm mb-7">Join teams already using DocsHub to ship better docs.</p>
        <div className="flex justify-center gap-3">
          <Link href="/workspace" className="inline-flex items-center justify-center rounded-lg px-5 h-11 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400 transition-colors">
            Try Now
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-5 h-11 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
            Sign in with OAuth
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
        © 2026 DocsHub · Built with Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
