const Hp = require('hemera-plugin');
const HemeraJoi = require('hemera-joi');
import { NatsPubSub } from 'graphql-nats-subscriptions';




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


module.exports = Hp(hemeraCounter, {
  hemera: '>=2.0.0-0',
  name: require('../package.json').name,
});
