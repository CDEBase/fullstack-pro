import * as ILogger from 'bunyan';
const Hp = require('hemera-plugin');
import { Container } from 'inversify';
import * as Hemera from 'nats-hemera';
const HemeraJoi = require('hemera-joi');
import { NatsPubSub } from 'graphql-nats-subscriptions';

function WorkspaceServicePlugin(
	hemera: Hemera,
	options: { client: any, settings: any; },
	done
) {
	const { settings, client } = options;
	const topic = `${HemeraTopics.ActivityCollector}/${settings.subTopic}`;

	const pubsub = new NatsPubSub({ client, logger: hemera.log });

	const container = new Container();
}

module.exports = Hp(WorkspaceServicePlugin, {
	hemera: '>=2.0.0-0',
	name: require('../../package.json').name,
});
