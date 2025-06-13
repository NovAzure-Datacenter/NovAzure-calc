# `src/lib/api` Directory

This directory is dedicated to housing **client functions for interacting with backend/calculations HTTP APIs**.

## Purpose

The primary purpose of `src/lib/api` is to:

1.  **Abstract External API Calls:** Provide a centralized place for functions that make HTTP requests (e.g., `fetch`) to services that are *not* part of this Next.js application's internal API routes (`src/app/api`).
2.  **Encapsulate API Logic:** Manage API base URLs, headers (like authentication tokens), error handling, and request/response transformations specific to each external service.


## How to Use These Functions

Functions defined here can be imported and called from:

* **Next.js Server Components:** For server-side data fetching directly from the external API.
* **Next.js Server Actions:** When a server-side action needs to communicate with the external API.
* **Next.js API Routes (`src/app/api`):** If you need to create a proxy endpoint for client-side requests to the external API (e.g., to hide API keys or perform server-side validation).

