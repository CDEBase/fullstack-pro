/// <reference path='../../../../typings/index.d.ts' />

import * as fs from 'fs';
import { PUBLIC_SETTINGS } from './public-config';

export const SETTINGS: __SETTINGS__ = {
    ...PUBLIC_SETTINGS,
    BACKEND_URL: process.env.BACKEND_URL || __BACKEND_URL__,
    CLIENT_URL: process.env.CLIENT_URL || __BACKEND_URL__,
    NATS_URL: process.env.NATS_URL,
    NATS_USER: process.env.NATS_USER,
    NATS_PW: process.env.NATS_PW,
};
