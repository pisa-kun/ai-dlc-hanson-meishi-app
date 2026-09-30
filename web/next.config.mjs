import createNextIntlPlugin from 'next-intl/plugin';

// next-intl の getRequestConfig は web/lib/i18n.ts にあるため明示指定する
const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const isExport = process.env.NEXT_BUILD_MODE === 'export';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export は build 時のみ有効にする (next dev との非互換を避ける)
  ...(isExport ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
