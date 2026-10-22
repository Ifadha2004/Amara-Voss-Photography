import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

// Runs before a route. Looks up the session from the cookie.
// No session: stop with 401. Session: attach the user and carry on.
export async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Please sign in" });
  }

  req.user = session.user;
  next();
}