const Hp = require('hemera-plugin');
const HemeraJoi = require('hemera-joi');
import { NatsPubSub } from 'graphql-nats-subscriptions';


exports.options = {
  name: require('../package.json').name,
};

exports.plugin = Hp(hemeraCounter, '>=2.0.0-0');

function hemeraCounter (hemera, opts, done) {
  const topic = 'counter';

  hemera.add({
    topic,
    cmd: 'add',
  }, (req, cb) => {
    cb(null, req.a + req.b);
  });

  done();
}




