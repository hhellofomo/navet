import { spawnSync } from 'node:child_process';

const result = spawnSync('git', ['diff', '--cached', '--name-only'], {
  encoding: 'utf8',
});

if (result.status !== 0) {
  console.error(result.stderr);
  process.exit(result.status ?? 1);
}

const stagedFiles = result.stdout
  .split('\n')
  .map((file) => file.trim())
  .filter(Boolean);

const hasDocsChange = stagedFiles.some(
  (file) => file === 'README.md' || file === 'CONTRIBUTING.md' || file.startsWith('docs/')
);

const docsSensitivePrefixes = [
  'src/app/features/settings/',
  'src/app/features/dashboard/',
  'src/app/features/lighting/',
  'src/app/components/shared/entity-card-',
  'src/app/components/shared/interaction-preview-card.tsx',
  'src/app/components/shared/card-size-selector.tsx',
  'src/app/stores/settings-store.ts',
  'src/app/stores/types.ts',
  'src/app/stores/selectors.ts',
  'src/app/utils/dashboard-config.ts',
  '.github/workflows/',
  'docker-compose.yml',
  'package.json',
];

const needsDocsReview = stagedFiles.some((file) =>
  docsSensitivePrefixes.some((prefix) => file.startsWith(prefix))
);

if (needsDocsReview && !hasDocsChange) {
  console.error(
    'This commit changes user-facing settings, dashboard behavior, build workflow, or package commands without a staged docs update.'
  );
  console.error('Stage an update to README.md, CONTRIBUTING.md, or docs/ before committing.');
  process.exit(1);
}

console.log('Docs relevance check passed.');
