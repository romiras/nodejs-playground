describe('dummy unit test', () => {
	it('has REDIS_URL not empty', () => {
		expect(process.env.REDIS_URL).toMatch(/^redis:\/\/(.+)$/);
	});
});
