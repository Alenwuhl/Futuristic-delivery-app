import { program } from 'commander';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { __dirname } from '../utils.js';

// Configure commander for environment selection
program
  .option('-e, --env <type>', 'Select environment', 'development')
  .parse(process.argv);

const envOptions = {
  development: '.env.development',
  production: '.env.production'
};

const envFile = envOptions[program.opts().env] || '.env.development';
dotenvConfig({ path: resolve(__dirname, 'config/env', envFile) });

