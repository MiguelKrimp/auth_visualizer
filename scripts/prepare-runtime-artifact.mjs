import { cp, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactDir = path.join(rootDir, 'artifacts', 'runtime');

const artifactPackageJson = {
  name: 'auth_visualizer_runtime',
  version: '1.0.0',
  private: true,
  workspaces: ['packages/common', 'packages/server'],
  scripts: {
    start: 'npm run start -w @auth-visualizer/server',
  },
};

const requiredPaths = [
  path.join(rootDir, 'packages', 'common', 'dist'),
  path.join(rootDir, 'packages', 'server', 'dist'),
  path.join(rootDir, 'packages', 'server', 'dist', 'index.js'),
];

const copyEntries = [
  path.join('packages', 'common', 'package.json'),
  path.join('packages', 'common', 'dist'),
  path.join('packages', 'server', 'package.json'),
  path.join('packages', 'server', 'dist'),
];

const runtimeReadme = `# Runtime Artifact

This folder is a runnable app artifact with built server files and installed production dependencies.

## Start

1. Add a .env.production file at this folder root.
2. Run:

  npm run start
`;

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyEntry(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(artifactDir, relativePath);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, { recursive: true });
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed with exit code ${code ?? 'unknown'}`));
    });
  });
}

async function main() {
  for (const requiredPath of requiredPaths) {
    if (!(await pathExists(requiredPath))) {
      throw new Error(
        `Missing build output: ${path.relative(rootDir, requiredPath)}. Run "npm run build" first.`,
      );
    }
  }

  await rm(artifactDir, { recursive: true, force: true });
  await mkdir(artifactDir, { recursive: true });

  await writeFile(
    path.join(artifactDir, 'package.json'),
    `${JSON.stringify(artifactPackageJson, null, 2)}\n`,
    'utf8',
  );

  for (const entry of copyEntries) {
    await copyEntry(entry);
  }

  await writeFile(path.join(artifactDir, 'README_RUNTIME.md'), runtimeReadme, 'utf8');

  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  await runCommand(
    npmCommand,
    ['install', '--omit=dev', '-w', '@auth-visualizer/common', '-w', '@auth-visualizer/server'],
    artifactDir,
  );

  process.stdout.write(`Runtime artifact prepared at ${path.relative(rootDir, artifactDir)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
