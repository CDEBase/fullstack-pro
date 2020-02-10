"use strict";

let { ServiceBroker } 	= require("moleculer");
let MyService 			= require("../../index");

let topicName = require("../../package.json").name;
// Create broker
let broker = new ServiceBroker({
	logger: console
});

// Load my service
broker.createService(MyService);

// Start server
broker.start().then(() => {

	// Call action
	broker
		.call(`${topicName}.test`, { name: "John Doe" })
		.then(broker.logger.info)
		.catch(broker.logger.error);

});
