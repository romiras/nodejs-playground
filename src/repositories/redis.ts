import { logger } from '../logger';
import { ConfigService } from '../services/service.config';
import { createClient } from 'redis';

export interface IKVRepository {
	Connect(): Promise<void>;
	Close(): Promise<void>;
	Get(key: string): Promise<string>;
	Set(key: string, value: string): Promise<void>;
}

export class RedisRepository implements IKVRepository {
	client: any;

	constructor() {
		const redis_url: string = ConfigService.redisUrl;
		logger.log('info', 'Connecting to', ConfigService.redisUrl);
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
		return this.client.get(key);
	}

	async Set(key: string, value: string): Promise<void> {
		return this.client.set(key, value);
	}
}
