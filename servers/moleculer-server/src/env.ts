/* eslint-disable jest/require-hook */
import * as dotenv from 'dotenv';
if (process.env.ENV_FILE) {
    dotenv.config({ path: process.env.ENV_FILE });
}
