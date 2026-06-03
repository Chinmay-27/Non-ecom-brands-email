import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the repo root is the tracing root so relative paths resolve correctly.
  outputFileTracingRoot: __dirname,
  // Explicitly bundle clients/ with every route that reads it via fs.
  outputFileTracingIncludes: {
    "/": ["./clients/**/*"],
    "/api/email/[slug]/[campaign]/[email]": ["./clients/**/*"],
  },
};

export default nextConfig;
