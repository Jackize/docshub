import { DocFile, Folder } from "./types";

export const mockFolders: Folder[] = [
  { id: "f1", name: "Middleware", parentId: null },
  { id: "f2", name: "Partner Integration Guide", parentId: "f1" },
];

export const mockFiles: DocFile[] = [
  {
    id: "doc1",
    name: "AI Profile Builder Wireframe Prototype",
    type: "html",
    folderId: null,
    version: 2,
    updatedAt: new Date("2026-02-10"),
    author: "Thanh Hao",
    breadcrumb: ["Documents"],
    content: `<h1>AI Profile Builder Wireframe Prototype</h1>
<p>This document outlines the wireframe and prototype specifications for the AI Profile Builder feature.</p>
<h2>Overview</h2>
<p>The AI Profile Builder allows users to automatically generate professional profiles using AI-powered suggestions.</p>
<ul>
  <li>Drag-and-drop interface</li>
  <li>Real-time AI suggestions</li>
  <li>Multiple export formats</li>
</ul>`,
    history: [
      { version: 2, date: new Date("2026-02-10"), author: "Thanh Hao", summary: "Updated AI suggestions section", content: "" },
      { version: 1, date: new Date("2026-01-20"), author: "Thanh Hao", summary: "Initial wireframe draft", content: "" },
    ],
  },
  {
    id: "doc2",
    name: "Technical Proposal: Stripe Payment Elements",
    type: "md",
    folderId: null,
    version: 1,
    updatedAt: new Date("2026-01-28"),
    author: "Thanh Hao",
    breadcrumb: ["Documents"],
    content: `# Technical Proposal: Stripe Payment Elements

## Overview

This document proposes integrating Stripe Payment Elements into the checkout flow.

## Goals

- Reduce PCI compliance scope
- Support 30+ payment methods
- Improve checkout conversion rates

## Architecture

\`\`\`typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PK!);
\`\`\`

## Timeline

| Phase | Duration |
|-------|----------|
| Setup & Integration | 1 week |
| Testing | 3 days |
| Deployment | 2 days |
`,
    history: [
      { version: 1, date: new Date("2026-01-28"), author: "Thanh Hao", summary: "Initial proposal", content: "" },
    ],
  },
  {
    id: "doc3",
    name: "[MP] Seller Onboarding with AI Profile Builder",
    type: "html",
    folderId: null,
    version: 3,
    updatedAt: new Date("2026-02-15"),
    author: "Thanh Hao",
    breadcrumb: ["Documents"],
    content: `<h1>[MP] Seller Onboarding with AI Profile Builder</h1>
<p>Master proposal for integrating AI Profile Builder into the seller onboarding flow.</p>
<h2>Scope</h2>
<ul>
  <li>Automated profile generation</li>
  <li>Identity verification</li>
  <li>Payment setup</li>
</ul>`,
    history: [
      { version: 3, date: new Date("2026-02-15"), author: "Thanh Hao", summary: "Added identity verification section", content: "" },
      { version: 2, date: new Date("2026-02-05"), author: "Thanh Hao", summary: "Updated payment setup flow", content: "" },
      { version: 1, date: new Date("2026-01-15"), author: "Thanh Hao", summary: "Initial master proposal", content: "" },
    ],
  },
  {
    id: "doc4",
    name: "API Authentication guide",
    type: "md",
    folderId: "f2",
    version: 3,
    updatedAt: new Date("2026-02-04"),
    author: "Thanh Hao",
    breadcrumb: ["Middleware", "Partner Integration Guide"],
    content: `# API Authentication guide

## Overview

This guide explains how to authenticate with the Partner Integration API.

## OAuth 2.0 Flow

The API uses OAuth 2.0 with the Authorization Code flow.

### Step 1: Request Authorization

\`\`\`bash
GET /oauth/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=read:docs write:docs
\`\`\`

### Step 2: Exchange Code for Token

\`\`\`bash
POST /oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "AUTHORIZATION_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "YOUR_REDIRECT_URI"
}
\`\`\`

### Step 3: Use the Access Token

\`\`\`bash
GET /api/v1/docs
Authorization: Bearer YOUR_ACCESS_TOKEN
\`\`\`

## Token Refresh

Access tokens expire after **1 hour**. Use the refresh token to obtain a new one:

\`\`\`bash
POST /oauth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "refresh_token": "YOUR_REFRESH_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 401 | Unauthorized — invalid or expired token |
| 403 | Forbidden — insufficient scope |
| 429 | Rate limit exceeded |
`,
    history: [
      { version: 3, date: new Date("2026-02-04"), author: "Thanh Hao", summary: "Fixed API authentication guide", content: "" },
      { version: 2, date: new Date("2026-01-20"), author: "Thanh Hao", summary: "Updated OAuth documentation", content: "" },
      { version: 1, date: new Date("2026-01-05"), author: "Thanh Hao", summary: "Initial content", content: "" },
    ],
  },
];
