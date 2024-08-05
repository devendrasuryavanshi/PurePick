/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'assets.aceternity.com',
            },
            {
                protocol: 'https',
                hostname: 'https://nikhil-belide.netlify.app/images',
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
