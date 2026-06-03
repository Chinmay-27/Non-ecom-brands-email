/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tell Vercel's bundler to include the generated clients/ data
  // alongside every serverless function (fs reads dynamic paths so
  // the tracer can't discover them automatically).
  outputFileTracingIncludes: {
    "/**": ["./clients/**/*"],
  },
};

export default nextConfig;
