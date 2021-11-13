import * as lib from 'amqplib';

const amqpUrl = process.env.AMQP_URL || 'amqp://127.0.0.1:5672';
const queue = 'foo';

const sleep = time => {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
};

async function callback(body: string) {
	console.log('Processing body:', body);
	await sleep(1000);
	console.log('End processing body:', body);

	return Promise.resolve();
}

(async () => {
	let conn: lib.Connection;
	let channel: lib.Channel;

	try {
		conn = await lib.connect(amqpUrl);
		channel = await conn.createChannel();
	} catch (err) {
		console.error(err);
	}

	console.log(` [*] Waiting for messages on queue '${queue}'. To exit press CTRL+C.`);
	await channel.consume(
		queue,
		async (msg: lib.ConsumeMessage) => {
			if (msg === null) {
				return;
			}

			const body = msg.content.toString();
			console.log(` [x] Received ${body}`);

			try {
				await callback(body);
			} catch (error) {
				console.error(error);
				return channel.nack(msg);
			}
			return channel.ack(msg);
		},
		{ noAck: false },
	);
})();
