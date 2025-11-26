import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'X-Robots-Tag',
    value: 'noindex, nofollow, noarchive',
  },
  {
    key: 'Permissions-Policy',
    value: 'interest-cohort=()',
  },
  {
    key: 'Referrer-Policy',
    value: 'no-referrer',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

import { withBotId } from 'botid/next/config';

export default withBotId(nextConfig);
