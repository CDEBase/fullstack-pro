'use strict';

const Hp = require('hemera-plugin');

exports.plugin = Hp(function hemeraTestPlugin(options, next) {
    const hemera = this;
    const topic = 'testPlugin';
    this.log.info('received options (%j)', options);
    hemera.add({
        topic,
        cmd: 'add',
    }, async function (req) {
        const result = await Promise.resolve({
            result: req.a + req.b,
        });
        return result;
    });

    next();
});

exports.options = {};

exports.attributes = {
    pkg: require('../../package.json'),
};
