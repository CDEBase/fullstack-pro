/// <reference path='../../../../typings/index.d.ts' />
import * as fs from 'fs';
import { PUBLIC_SETTINGS } from './public-config';
process.env.ENV_FILE && require('dotenv').config({ path: process.env.ENV_FILE });

const SPIN_CONFIG_NAME = '.spinrc.json';
const { options : spin }: { options: __SPIN_OPTIONS__} = JSON.parse(fs.readFileSync(SPIN_CONFIG_NAME).toString());

export const SETTINGS: __SETTINGS__ = {
    ...spin,
    ...PUBLIC_SETTINGS,
    BACKEND_URL: process.env.BACKEND_URL || __BACKEND_URL__,
    CLIENT_URL: process.env.CLIENT_URL || __BACKEND_URL__,
    NATS_URL: process.env.NATS_URL,
    NATS_USER: process.env.NATS_USER,
    NATS_PW: process.env.NATS_PW,
};
