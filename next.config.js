/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "res.cloudinary.com", 
      "cdn-icons-png.freepik.com", 
      "cdn.haitrieu.com", 
      "t4.ftcdn.net",
      "www.cdnlogo.com"
    ],
  },
  publicRuntimeConfig: {
    // Có sẵn trên cả server và client
  },
  serverRuntimeConfig: {
    // Chỉ có sẵn trên server
  },
};

module.exports = nextConfig;
