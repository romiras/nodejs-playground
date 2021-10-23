import { exit } from 'process';
import { RedisClient } from './repositories/redis';
import { logger } from './logger';

(async () => {
	const client = new RedisClient();

	try {
		await client.Connect();
	} catch (error) {
		console.error(error);
		exit(1);
	}

	await client.Set('key', 'zzz').catch(err => {
		logger.log('error', err);
		throw new Error('set error');
	});

	const value = await client.Get('key').catch(err => {
		console.error(err);
		throw new Error('get error');
	});

	console.log('value: ' + value);

	await client.Close();
})();
