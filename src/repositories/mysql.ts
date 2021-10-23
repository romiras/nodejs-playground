import { logger } from '../logger';
import { ConfigService } from '../services/service.config';
import * as mysql from 'mysql2/promise';

export interface ISQLRepository {
	Connect(): Promise<void>;
	Close(): Promise<void>;
}

export class MySQLRepository implements ISQLRepository {
	conn: mysql.Connection;
	drv: unknown;

	constructor() {
		logger.log('info', 'Connecting to', ConfigService.mysqlUrl);
	}

	async Connect(): Promise<void> {
		this.conn = await mysql.createConnection({
			uri: ConfigService.mysqlUrl,
		});
		return this.conn.ping();
	}

	async Close(): Promise<void> {
		this.conn.destroy();
		return Promise.resolve();
	}

	async Version(): Promise<void> {
		const [rows, fields] = await this.conn.execute(`SELECT VERSION() as ver`);
		const ver: string = rows[0]['ver'];
		logger.log('info', `MySQL ${ver}`);
		return Promise.resolve();
	}
}
