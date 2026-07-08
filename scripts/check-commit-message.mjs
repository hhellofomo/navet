import fs from 'node:fs';
import process from 'node:process';

const COMMIT_TYPES = ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'build', 'ci', 'perf', 'style'];
const FIRST_LINE_LIMIT = 72;
const messageFile = process.argv[2];

if (!messageFile) {
  console.error('Missing commit message file path.');
  process.exit(1);
}

const message = fs.readFileSync(messageFile, 'utf8');
const firstLine = message.split(/\r?\n/, 1)[0]?.trim() ?? '';

if (firstLine.length === 0) {
  console.error('Commit message is empty.');
  process.exit(1);
}

if (firstLine.length > FIRST_LINE_LIMIT) {
  console.error(
    `Commit summary must be ${FIRST_LINE_LIMIT} characters or fewer. Got ${firstLine.length}.`
  );
  process.exit(1);
}

const conventionalCommitPattern = new RegExp(
  `^(${COMMIT_TYPES.join('|')})(\\([a-z0-9][a-z0-9-]*\\))?: [a-z0-9][a-z0-9 /,&+()-]*[a-z0-9)]$`
);

if (!conventionalCommitPattern.test(firstLine)) {
  console.error(
    'Commit message must match `type(scope): summary` using a supported type and lowercase summary.'
  );
  console.error(`Supported types: ${COMMIT_TYPES.join(', ')}`);
  console.error(`Received: ${firstLine}`);
  process.exit(1);
}

if (firstLine.endsWith('.')) {
  console.error('Commit summary must not end with a period.');
  process.exit(1);
}

console.log('Commit message format looks good.');
