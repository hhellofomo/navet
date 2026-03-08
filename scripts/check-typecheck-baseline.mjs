import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const BASELINE_PATH = '.typecheck-baseline.txt';

function normalize(output) {
  return output
    .replace(/\u001B\[[0-9;]*m/g, '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim();
}

const baseline = normalize(readFileSync(BASELINE_PATH, 'utf8'));
const result = spawnSync('pnpm', ['exec', 'tsc', '--noEmit'], {
  encoding: 'utf8',
});
const current = normalize(`${result.stdout}\n${result.stderr}`);

if (current !== baseline) {
  console.error('Typecheck output changed from the recorded baseline.');
  console.error(
    'If you intentionally fixed or updated TypeScript errors, refresh .typecheck-baseline.txt and relevant docs in the same commit.'
  );
  process.exit(1);
}

console.log('Typecheck baseline unchanged.');
