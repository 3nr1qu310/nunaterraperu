import { build } from 'esbuild';
import { existsSync } from 'fs';

const entryPoint = './dist/server/entry.mjs';

if (!existsSync(entryPoint)) {
  console.error('dist/server/entry.mjs not found — run astro build first.');
  process.exit(1);
}

await build({
  entryPoints: [entryPoint],
  bundle: true,
  outfile: './dist/client/_worker.js',
  format: 'esm',
  platform: 'browser',
  conditions: ['workerd', 'worker', 'browser'],
  external: ['cloudflare:*', '__STATIC_CONTENT_MANIFEST'],
  logLevel: 'info',
  minify: false,
});

console.log('✓ Worker bundled → dist/client/_worker.js');
