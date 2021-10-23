describe('dummy unit test', () => {
	it('has REDIS_URL non empty', () => {
		expect(process.env.REDIS_URL).toMatch(/^redis:\/\/(.+)$/);
	});

	it('has RABBITMQ_URL non empty', () => {
		expect(process.env.RABBITMQ_URL).toMatch(/^amqp:\/\/(.+)$/);
	});
});
