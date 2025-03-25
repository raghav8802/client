/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swalay-music-files.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb' // Set your desired limit (100MB in this case)
    }
  }
};

export default nextConfig;
  
