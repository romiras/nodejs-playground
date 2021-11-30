import { logger } from './logger'

logger.log('info', 'start')

const { Client } = require('@elastic/elasticsearch');
const AWS = require('aws-sdk');
const createAwsElasticsearchConnector = require('aws-elasticsearch-connector');

// (Optional) load profile credentials from file
// AWS.config.update({
// 	profile: 'affo-my',
// 	logger: console,
// });

// AWS.config.logger = console;

// console.log(JSON.stringify(AWS.config, null, '  '));

const client = new Client({
	...createAwsElasticsearchConnector(AWS.config),
	node: process.env.ES_URL,
});

(async () => {
	console.log(`Connecting to ${process.env.ES_URL}`);
	client
		.ping({}, { requestTimeout: 5000 })
		.then(res => console.log(res.statusCode))
		.catch(error => {
			console.error(error);
		});
})();
