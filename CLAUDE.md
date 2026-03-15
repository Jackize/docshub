# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev       # Start dev server (Next.js)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Architecture

**DocsHub** is a frontend-only document management app built with Next.js App Router. It has no backend — all data is mocked.

### Routes

- `/` — Landing/marketing page
- `/login` — OAuth login (Google & GitHub, UI only)
- `/workspace` — Main app (client component, `"use client"`)

### Component Structure

`workspace/page.tsx` is the root client component managing:
- `selectedFile` state → passed down to `Sidebar` and `MainContent`

Key feature components in `src/components/`:
- **Sidebar** — folder tree with expand/collapse, file type badges
- **TopNavbar** — search dropdown (Cmd+K), upload modal trigger
- **MainContent** — breadcrumb, file metadata, switches between view/edit mode
- **MarkdownPreview** — renders `.md` via `react-markdown` + `remark-gfm`, renders `.html` via `dangerouslySetInnerHTML`
- **EditorSplitView** — live split-view editor (textarea + preview side-by-side)
- **UploadModal** — drag-and-drop via `react-dropzone`, accepts `.md` and `.html`
- **VersionHistoryPanel** — right-side drawer showing version history list

### Data & Types

- `src/lib/types.ts` — `DocFile`, `Folder`, `VersionEntry` interfaces
- `src/lib/mock-data.ts` — sample files with version histories, folder structure

### Key Patterns

- Path alias: `@/*` → `src/*`
- UI components from shadcn/ui (`src/components/ui/`), configured with `base-nova` style
- Styling: TailwindCSS v4 + `@tailwindcss/typography` for prose content
- Icons: `lucide-react`
- Class utilities: `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts`

### shadcn/ui Caveat

This project uses `@base-ui/react` (not `@radix-ui/react-*`). When adding new shadcn components, verify imports and APIs match `@base-ui/react` rather than the default Radix-based shadcn components.
