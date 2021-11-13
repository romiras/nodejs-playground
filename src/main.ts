import { logger } from './logger';
import { RedisRepository } from './repositories/redis';
import { AmqpConsumer } from './handlers/amqp';
import { exit } from 'process';

const process = require('process');

const redisDB = new RedisRepository();
const mq = new AmqpConsumer();

async function connect(): Promise<void> {
	const promises: Promise<void>[] = [redisDB.Connect(), mq.Connect()];

	await Promise.all(promises).catch(error => {
		logger.log('error', '!! failed.');
		return Promise.reject();
	});
}

async function close(): Promise<void> {
	logger.log('info', '!! Closing ALL');
	await redisDB.Close();
	logger.log('info', '!! ALL closed.');
}

async function Do(): Promise<void> {
	await redisDB.Set('key', 'zzz').catch(err => {
		logger.log('error', err);
		throw new Error('set error');
	});

	const value = await redisDB.Get('key').catch(err => {
		console.error(err);
		throw new Error('get error');
	});
	logger.log('info', 'Got value =', value);
}

const shutdown = async function () {
	return new Promise<void>((resolve, reject) => {
		close();
		resolve();
	}).then(res => {
		logger.log('info', 'Good bye!');
	});
};

const beforeExit = async function (sig) {
	logger.log('info', `Performing graceful shutdown`, {
		signal: sig,
	});
	await shutdown();
	exit(0);
};

process
	.on('unhandledRejection', (reason, promise) => {
		logger.log('error', 'Unhandled Rejection thrown', {
			error: reason,
			promise,
		});
		shutdown();
		exit(3);
	})
	.on('uncaughtException', err => {
		logger.log('error', 'Uncaught Exception thrown', {
			error: err,
		});
		shutdown();
		exit(2);
	});

process.once('SIGTERM', beforeExit);
process.once('SIGINT', beforeExit);

const sleep = time => {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
};

(async () => {
	logger.log('info', 'Initializing...');

	try {
		logger.log('info', '!! Connecting to ALL');
		await connect();
		logger.log('info', '!! ALL connected.');
		logger.log('info', 'Initialized.');
	} catch (error) {
		logger.log('error', 'Failed to connect ALL. Aborting.');
		exit(1);
	}

	await Do();
	await close();

	await mq.Consume('foo', async (body: string) => {
		// const obj = JSON.parse(body);
		// const event = obj as FooMessage;

		logger.log('info', 'Processing body:', body);
		await sleep(1000);
		logger.log('info', 'End processing body:', body);

		return Promise.resolve();
	});
})();
