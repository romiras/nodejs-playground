import { logger } from '../logger';
import { createClient } from 'redis';

export class RedisClient {
	client: any;

	constructor() {
		const redis_url: string = process.env.REDIS_URL || 'redis://localhost:6379/0';
		logger.log('info', 'Connecting to', redis_url);
		this.client = createClient({ url: redis_url });

		this.client.on('error', err => {
			logger.log('error', 'Redis Client Error', err);
			throw new Error('Redis error occurred.');
		});
	}

	async Connect(): Promise<void> {
		return this.client.connect();
	}

	async Close(): Promise<void> {
		return this.client.quit();
	}

	async Get(key: string): Promise<string> {
		const value = this.client.get(key);
		return Promise.resolve(value);
	}

	async Set(key: string, value: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.set(key, value);
			resolve();
		});
	}
}
