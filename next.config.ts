import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  appDir: true,
};

const millionConfig = {
  auto: true, // if you're using RSC: auto: { rsc: true },
};

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/index",
        permanent: true,
      },
    ];
  },
};

export default million.next(nextConfig, millionConfig);
