import { createAuthClient } from "better-auth/react";

// No server address needed: requests go to the same origin,
// and the Vite proxy (or Vercel rewrite in production) forwards /api/auth to Express.
export const authClient = createAuthClient();