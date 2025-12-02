# PWA Configuration Note

## Current Status
PWA support is temporarily disabled in `next.config.ts` to avoid conflicts with Turbopack in development mode.

## To Re-enable PWA for Production

When you're ready to deploy, update `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

// Only apply PWA wrapper in production
const config = process.env.NODE_ENV === "production" 
  ? withPWAInit({
      dest: "public",
      cacheOnFrontEndNav: true,
      aggressiveFrontEndNavCaching: true,
      reloadOnOnline: true,
      workboxOptions: {
        disableDevLogs: true,
      },
    })(nextConfig)
  : nextConfig;

export default config;
```

This way PWA features will only be active in production builds, avoiding development conflicts.

## Testing PWA Features

To test PWA in production mode:

```bash
npm run build
npm run start
```

Then check in your browser's DevTools → Application → Service Workers
