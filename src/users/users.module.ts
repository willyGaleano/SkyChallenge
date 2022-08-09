import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from 'config';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/user.services';

@Module({
    imports: [
        HttpModule,
        ClientsModule.registerAsync([
            {
                name: 'SUBSCRIBERS_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigType<typeof config>) => {
                    const { user, password, host, queueName } =
                        configService.rabbitmq;
                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [`amqp://${user}:${password}@${host}`],
                            queue: queueName,
                            queueOptions: {
                                durable: true,
                            },
                        },
                    };
                },
                inject: [config.KEY],
            },
        ]),
    ],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
