# AI Prompt: Build a Modern Documentation Manager UI (Landing + App UI)

## Project Goal

Create a **modern documentation management web app UI** similar to tools like GitBook, Notion Docs, or internal developer documentation systems.

The goal is **UI/UX first**, focusing on layout, interactions, and visual hierarchy.  
Backend logic and real API integration will be implemented later.

This project should be **Vercel-ready** and built with:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui components
- Lucide icons

The design must feel **modern, clean, developer-friendly, and minimal**.

---

# Overall Layout

The app should follow a **3-panel documentation UI layout**:

1. **Left Sidebar**
2. **Main Content Area**
3. **Top Navigation Bar**

Similar to documentation platforms like:

- GitBook
- Notion Docs
- Vercel Docs

---

# Landing Page (Marketing Page)

Create a simple landing page before login.

## Sections

### Hero Section

- Product name: **DocsHub**
- Subtitle:  
  "A modern documentation workspace for teams."

Buttons:

- Get Started
- Login

Visual:

- Screenshot preview of the app UI

---

### Features Section

Cards with icons:

1. OAuth Login
2. File Upload
3. Markdown & HTML Preview
4. Version History
5. Folder Organization
6. Git-like Change History

---

### CTA Section

Text:
"Manage your documentation like a developer."

Buttons:

- Try Now
- Sign in with OAuth

---

# App UI Layout

After login, users see the **documentation workspace**.

---

# Top Navigation Bar

Contains:

Left:

- Logo
- Workspace name

Center:

- Search bar
  - Placeholder: "Search documentation..."

Right:

- Upload Button
- Download Button
- User Avatar
- Logout Button

---

# Left Sidebar

This panel manages files and folders.

### Folder Tree

Structure example:

Documents

- AI Profile Builder
- Technical Proposal
- Seller Onboarding

Each item should show:

Icon:

- Markdown icon
- HTML icon

Metadata badge:

- File type (MD / HTML)

Features:

- Expand / collapse folders
- Create folder
- Upload file
- Rename file
- Delete file

---

# Main Content Area

Displays file content.

When selecting a file:

Show:

## File Header

Title

Metadata row:

- File Type
- Version
- Last Updated Date
- Author

Example:

Markdown | v3 | Updated Feb 4 2026

Buttons:

- Edit
- Delete
- Download
- History

---

# Markdown Preview

Render markdown preview.

Support:

- headings
- code blocks
- lists
- links
- images

Use a **clean documentation style** similar to:

- GitHub Markdown
- GitBook docs

---

# File Editing UI

When clicking **Edit**:

Switch to a **split view editor**

Left side:
Markdown editor

Right side:
Live preview

Buttons:

- Save
- Cancel

---

# Version History Panel

A modal or right-side drawer.

Shows file history like Git.

Each version includes:

- Version number
- Date
- Author
- Change summary

Example:

v5 — Fixed API authentication guide  
v4 — Updated OAuth documentation  
v3 — Initial content

Buttons:

- Restore version
- Compare version

---

# Upload UI

Upload modal with:

Drag & Drop area

Accepted file types:

- .md
- .html

After upload:

Show preview

---

# File Metadata Display

Each file should display:

File Type Badge

Examples:

Markdown
HTML

Version Number

Example:

v1
v2
v3

Last Updated Date

Example:

Feb 4 2026

---

# Search Function

Top search bar should:

Search across:

- File names
- Folder names
- Content

Results dropdown similar to **VSCode quick search**.

---

# Authentication UI

Use OAuth login UI.

Login screen:

Buttons:

Sign in with:

- Google
- GitHub

After login redirect to workspace.

---

# Required UI Features

The UI must support these visible features:

- OAuth login
- Upload files
- Folder management
- Markdown preview
- HTML preview
- File editing
- Delete file
- File version history
- File type display
- Last updated timestamp
- Global search
- Download file
- Login / Logout

---

# UI Style Guide

Design language:

Modern developer tools UI

Inspired by:

- Vercel
- Notion
- GitHub
- Linear

Colors:

Neutral light theme

Primary:
Indigo / Blue accent

Typography:

Inter font

Spacing:

Generous whitespace

Rounded corners:

lg

Shadows:

Soft elevation

---

# Component Structure

Create reusable components:

AppLayout

Sidebar

FileTree

TopNavbar

SearchBar

FileHeader

MarkdownPreview

EditorSplitView

VersionHistoryPanel

UploadModal

FolderItem

FileItem

---

# Empty States

Add friendly empty states:

No files

"Upload your first markdown file"

No search results

"No documents found"

---

# Goal

Deliver a **polished documentation management UI** that feels production-ready.

Focus on:

- UX clarity
- smooth layout
- intuitive file navigation
- clean developer experience
