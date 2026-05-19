import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const frontendDir = resolve(root, 'custom_components/navet/frontend');
const publicDir = resolve(root, 'public');

await build({ configFile: resolve(root, 'vite.panel.config.ts') });

await mkdir(resolve(frontendDir, 'wallpapers'), { recursive: true });
await cp(resolve(publicDir, 'logo.svg'), resolve(frontendDir, 'logo.svg'));
await cp(resolve(publicDir, 'wallpapers'), resolve(frontendDir, 'wallpapers'), {
  recursive: true,
});
