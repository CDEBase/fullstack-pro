import * as ILogger from 'bunyan';
const Hp = require('hemera-plugin');
import * as Hemera from 'nats-hemera';
import { Container } from 'inversify';
const HemeraJoi = require('hemera-joi');
import { NatsPubSub } from 'graphql-nats-subscriptions';


function WorkspaceServicePlugin(hemera: Hemera, options: { settings: any, client: any }, done) {

  const { settings, client } = options;
  const topic = `${HemeraTopics.ActivityCollector}/${settings.subTopic}`;

  const pubsub = new NatsPubSub({ client, logger: hemera.log });

  let container = new Container();

}

module.exports = Hp(WorkspaceServicePlugin, {
  hemera: '>=2.0.0-0',
  name: require('../../package.json').name,
});
