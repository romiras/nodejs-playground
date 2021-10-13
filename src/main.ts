import { createClient } from 'redis';

const redis_url = process.env.REDIS_URL;
console.log('redis: ' + redis_url);

(async () => {
	const client = createClient({ url: redis_url });

	client.on('error', err => console.log('Redis Client Error', err));

	client.on('error', err => {
		console.log('Redis Client Error', err);
		throw new Error('Redis error occurred.');
	});

	await client.connect().catch(err => {
		console.error(err);
		throw new Error('connect error');
	});

	await client.set('key', 'zzz').catch(err => {
		console.error(err);
		throw new Error('set error');
	});

	const value = await client.get('key').catch(err => {
		console.error(err);
		throw new Error('get error');
	});

	console.log('value: ' + value);

	await client.quit();
})();
