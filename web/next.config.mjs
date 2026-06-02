import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// __dirname = <repo>/web — go one level up to include clients/ in serverless bundles
const REPO_ROOT = path.join(__dirname, "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Tell Next.js to trace files from the repo root (not just web/) so that
  // ../clients/** gets bundled into Vercel serverless functions.
  outputFileTracingRoot: REPO_ROOT,
  outputFileTracingIncludes: {
    "/**": ["../clients/**/*"],
  },
};

export default nextConfig;
