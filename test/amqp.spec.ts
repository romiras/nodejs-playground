import { logger } from '../src/logger';
import { AmqpConsumer } from '../src/handlers/amqp';
import { ConfigService } from '../src/services/service.config';

import amqplib from 'mock-amqplib';
jest.setMock('amqplib', amqplib);

describe('AMQP integration test', () => {
	it('consumes queue', async () => {
		// setup
		// const mockRequire = require('mock-require');
		// mockRequire('amqplib', 'mock-amqplib');

		const q = 'foo';

		// const mq = new AmqpConsumer();

		// await mq.Consume(q, async (body: string) => {
		// 	// const obj = JSON.parse(body);
		// 	// const event = obj as FooMessage;

		// 	logger.log('info', 'Got body:', body);
		// });

		const open = amqplib.connect(ConfigService.rabbitmqUrl);
		// Publisher
		open.then(function (conn) {
			return conn.createChannel();
		})
			.then(function (ch) {
				return ch.assertQueue(q, { durable: false }).then(function (ok) {
					return ch.sendToQueue(q, Buffer.from('something to do'));
				});
			})
			.catch(console.warn);

		// // teardow
		// mockRequire.stopAll();

		// expect(process.env.RABBITMQ_URL).toMatch(/^amqp:\/\/(.+)$/);
	});
});
