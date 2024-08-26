/* eslint-disable jest/require-hook */
import * as dotenv from 'dotenv-esm';
if (process.env.ENV_FILE) {
    dotenv.config({ path: process.env.ENV_FILE });
}