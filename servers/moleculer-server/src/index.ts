/// <reference types="webpack-env" />
import './env';
import 'reflect-metadata';
import { StackServer } from '@common-stack/server-stack';
import modules, { settings } from './modules';

const service = new StackServer(modules, settings);
async function start() {
    await service.initialize();
    await service.start();
}

start();
