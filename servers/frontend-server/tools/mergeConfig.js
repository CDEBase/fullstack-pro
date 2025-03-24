import fs from 'fs';
import path from 'path';
import { setupConfig } from '@common-stack/rollup-vite-utils/lib/utils/setupConfig.js';
import projectConfig from '../config.json' assert { type: 'json' };

// Function to merge configurations
const mergeConfigs = setupConfig(projectConfig);

// Ensure the 'app' directory exists
const appDir = path.resolve('app');
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir);
  console.log(`Created directory: ${appDir}`);
}

// Write the merged configuration to 'app/finalConfig.json'
const finalConfigPath = path.resolve(appDir, 'cde-webconfig.json');
fs.writeFileSync(finalConfigPath, JSON.stringify(mergeConfigs, null, 2));
console.log(`Merged configuration written to ${finalConfigPath}`);

// Add 'app' to .gitignore if not already present
const gitignorePath = path.resolve('.gitignore');
let gitignoreContent = '';
if (fs.existsSync(gitignorePath)) {
  gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
} else {
  fs.writeFileSync(gitignorePath, '');
  console.log('Created .gitignore file');
}

if (!gitignoreContent.includes('app')) {
  fs.appendFileSync(gitignorePath, '\napp\n');
  console.log('Added "app" to .gitignore');
}
