import * as lib from 'amqplib';
import { logger } from '../logger';
import { ConfigService } from '../services/service.config';

export type Message = string;
export type OnMessageCallback = (msg: unknown) => Promise<void>;

export interface IAmqpConsumer {
	Connect(): Promise<void>;
	Close(): Promise<void>;
	Consume(queue: string, callback: OnMessageCallback): Promise<unknown>;
}

export class AmqpConsumer implements IAmqpConsumer {
	connection: lib.Connection;
	channel: lib.Channel;

	async Connect(): Promise<void> {
		logger.log('info', 'Connecting to', ConfigService.rabbitmqUrl);
		return new Promise<void>((resolve, reject) => {
			lib.connect(ConfigService.rabbitmqUrl)
				.then(async conn => {
					this.connection = conn;
					this.channel = await conn.createChannel();
					resolve();
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		});
	}

	async Close(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async Consume(queue: string, callback: OnMessageCallback): Promise<unknown> {
		logger.log('info', 'DeclareQueue: ', queue);
		const queueOk = await this.channel.assertQueue(queue, { durable: false });
		if (!queueOk) {
			return Promise.reject();
		}

		logger.log('info', ' [*] Waiting for messages. To exit press CTRL+C');
		return this.channel.consume(
			queue,
			async (msg: lib.ConsumeMessage) => {
				if (msg === null) {
					return;
				}

				const body = msg.content.toString();
				logger.log('info', ` [x] Received ${body}`);

				try {
					await callback(body);
				} catch (error) {
					logger.log('error', error);
					return this.channel.nack(msg);
				}
				return this.channel.ack(msg);
			},
			{ noAck: false },
		);
	}
}
