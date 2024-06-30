/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "res.cloudinary.com", 
      "cdn-icons-png.freepik.com", 
      "cdn.haitrieu.com", 
      "t4.ftcdn.net"
    ],
  },
};

module.exports = nextConfig;
