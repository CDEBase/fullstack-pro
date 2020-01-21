'use strict';

const Hemera = require('nats-hemera');
const Plugin1 = require('./example-async');
const HemeraTestsuite = require('hemera-testsuite');
import 'jest';

// prevent warning message of too much listeners
process.setMaxListeners(0);

describe('hemera-testPlugin', function () {
    const PORT = 4222;
    const topic = 'testPlugin';
    let server;
    let originalTimeout;

    // Start up our own nats-server
    beforeAll(function (done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        server = HemeraTestsuite.start_server(PORT, null, done);
    });

    // Shutdown our server after we are done
    afterAll(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        server.kill();
        done();
    });

    it('Should be able to add two numbers', function (done) {
        const nats = require('nats').connect();
        const options = { a: 1};
        const hemera = new Hemera(nats, { logLevel: 'info' });
        hemera.use(Plugin1, options);

        hemera.ready(() => {
            hemera.ext('onServerPreRequest', async function (ctx, req, res) {
                await Promise.resolve();
            });

            hemera.act({
                topic,
                cmd: 'add',
                a: 1,
                b: 20,
            }, async function (err, resp) {
                try {
                    await resp;
                    expect(err).toBeNull();
                    expect(resp.result).toEqual(21);
                    hemera.close(done);
                } catch (err) {
                    hemera.close(done.fail);
                }

            });
        });

    });
    it('Should be able fail add two numbers', function (done) {
        const nats = require('nats').connect();

        const hemera = new Hemera(nats, { logLevel: 'info' });
        hemera.use(Plugin1);

        hemera.ready(() => {
            hemera.ext('onServerPreRequest', async function (ctx, req, res) {
                await Promise.resolve();
            });

            hemera.act({
                topic,
                cmd: 'add',
                a: 1,
                b: 21,
            }, async function (err, resp) {
                try {
                    await resp;
                    expect(err).toBeNull();
                    expect(resp.result).toEqual(20);
                    hemera.close(done.fail);

                } catch (err) {
                    hemera.close(done);
                }

            });
        });

    });
    it('Should be able to add two numbers', function (done) {
        const nats = require('nats').connect();

        const hemera = new Hemera(nats, { logLevel: 'info' });
        hemera.use(Plugin1);

        hemera.ready(() => {
            hemera.ext('onServerPreRequest', async function (ctx, req, res) {
                await Promise.resolve();
            });

            hemera.act({
                topic,
                cmd: 'add',
                a: 1,
                b: 0,
            }, async function (err, resp) {
                try {
                    await resp;
                    expect(err).toBeNull();
                    expect(resp.result).toEqual(1);
                    hemera.close(done);
                } catch (err) {
                    hemera.close(done.fail);
                }

            });
        });

    });
});
