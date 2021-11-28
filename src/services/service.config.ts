require('dotenv').config();

export class ConfigService {
	public static get redisUrl(): string {
		return process.env.REDIS_URL || 'redis://localhost:6379/0';
	}

	public static get rabbitmqUrl(): string {
		return process.env.RABBITMQ_URL || 'amqp://localhost';
	}
}
