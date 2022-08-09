import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
    return {
        test: {
            url: process.env.URL_TEST,
            pattern: process.env.PATTERN,
        },
        rabbitmq: {
            user: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
            host: process.env.RABBITMQ_HOST,
            queueName: process.env.RABBITMQ_QUEUE_NAME,
        },
    };
});
