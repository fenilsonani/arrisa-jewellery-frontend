/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        /* domains: ['fastly.picsum.photos', 'via.placeholder.com','hebbkx1anhila5yf.public.blob.vercel-storage.com','placehold.co','images.unsplash.com'], */
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    webpack(config, options) {
        config.module.rules.push({
            test: /\.m?js/,
            resolve: {
                fullySpecified: false,
            },
        });

        return config;
    },
};

export default nextConfig;
