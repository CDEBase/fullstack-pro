const Hp = require('hemera-plugin');
const HemeraJoi = require('hemera-joi');

import * as ILogger from 'bunyan';



exports.plugin = Hp(function hemeraContainerManager(options, next) {
  const hemera = this;
  const topic = 'container-manager';

  const { email, key, zone } = options;

  hemera.add({
    topic: 'math',
    cmd: 'add',
  }, async function (req) {
    return await req.a + req.b;
  });

  next();
});

exports.options = {};

exports.attributes = {
  pkg: require('../package.json'),
};
