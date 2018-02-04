import 'reflect-metadata';
require('dotenv').config({ path: process.env.ENV_FILE });

import * as Hemera from 'nats-hemera';
import * as nats from 'nats';
const HemeraJoi = require('hemera-joi');
const HemeraZipkin = require('hemera-zipkin');
const HemeraSql  = require('hemera-sql-store');

const ContainerHemera = require('@sample-stack/hemera-counter');


const client = nats.connect({
    'url': process.env.NATS_URL,
    'user': process.env.NATS_USER,
    'pass': process.env.NATS_PW,
});

const logLevel = process.env.HEMERA_LOG_LEVEL as Hemera.LogLevel || 'info';

const hemera = new Hemera(client, {
    logLevel: logLevel,
    childLogger: true,
    tag: require('../package.json').name,
    timeout: 10000,
});

hemera.use(HemeraJoi);
hemera.use(HemeraSql, {
    knex: {
        dialect: process.env.DB_TYPE,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        },
    },
});
hemera.use(HemeraZipkin, {
    host: process.env.ZIPKIN_URL,
    port: process.env.ZIPKIN_PORT,
    sampling: 1,
});
hemera.use(ContainerHemera, {
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY,
    zone: process.env.CLOUDFLARE_ZONE_ID,
});

// hemera.setOption('payloadValidator', 'hemera-joi');

hemera.ready(() => {
    // let Joi = hemera.exposition['hemera-joi'].joi;


});

