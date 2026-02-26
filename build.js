#!/usr/bin/env node
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const vitePath = join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const child = spawn('node', [vitePath, 'build'], { stdio: 'inherit' });

child.on('close', (code) => {
  process.exit(code);
});