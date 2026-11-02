import Stripe from "stripe";

// Fail closed: this assessment integration never accepts live-money keys.
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key?.startsWith("sk_test_")) throw new Error("Configure a Stripe test secret key");
  return new Stripe(key, { maxNetworkRetries: 2, timeout: 20000 });
}

export function siteOrigin() {
  const url = new URL(process.env.APP_URL);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) {
    throw new Error("APP_URL must use HTTPS (or localhost for development)");
  }
  return url.origin;
}
