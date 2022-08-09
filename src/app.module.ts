import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'config';
import { environments } from './environments';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                environments[process.env.NODE_ENV] || '.env',
                'rabbitmq.env',
            ],
            load: [config],
            isGlobal: true,
        }),
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
