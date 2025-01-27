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
                protocol: 'https',
                hostname: 'https://cdni.iconscout.com/illustration/premium/thumb/'
            },
            {
                protocol: "http",
                hostname: "**",
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
            },
        ],
    },
};

export default nextConfig;
