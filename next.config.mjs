import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand({ parsed: { ...process.env } });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['s.gravatar.com', 'lh3.googleusercontent.com'],
  },
};

export default nextConfig;
