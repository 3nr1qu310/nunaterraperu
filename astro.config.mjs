import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://nunaterraperu.com',

  output: 'static',

  adapter: cloudflare(),

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});