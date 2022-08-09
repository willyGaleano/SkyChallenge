import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { AxiosResponse } from 'axios';
import config from 'config';
import { lastValueFrom, Observable } from 'rxjs';
import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
        private readonly httpService: HttpService,
    ) {}

    async onApplicationBootstrap() {
        await this.subscribersService.connect();
    }

    async getAllUsers(): Promise<UserDto[]> {
        try {
            let usersDto: UserDto[] = [];
            let usersRMQ: UserDto[] = [];
            let usersResp: UserDto[] = [];
            const { url, pattern } = this.configService.test;
            const resp = await lastValueFrom(this.getExternalData(url));

            usersDto = this.responseData(resp);
            usersResp = usersDto.sort(this.orderDataById);
            usersRMQ = usersDto.filter((value) => value.id % 2 === 0);
            this.publishToRabbitMQ(usersRMQ, pattern);

            return usersResp;
        } catch (error) {
            console.log(`Error getAllUsers: ${error.message}`);
            return new Array<UserDto>();
        }
    }

    private getExternalData(url: string): Observable<AxiosResponse<User[]>> {
        return this.httpService.get<User[]>(url);
    }

    private responseData(resp: AxiosResponse<UserDto[]>): UserDto[] {
        let userResponse: UserDto[] = [];
        const { status, data } = resp;
        if (status === 200) {
            userResponse = data.map((value: User) => {
                const { address, ...rest } = value;
                return rest;
            });
        } else {
            console.log(`Status: ${status}`);
        }

        return userResponse;
    }

    private orderDataById = (a: UserDto, b: UserDto): number => {
        if (a.id === b.id) return 0;
        if (a.id > b.id) return -1;
        return 1;
    };

    private publishToRabbitMQ(data: UserDto[], pattern: string) {
        data.forEach(async (element) => {
            await lastValueFrom(this.subscribersService.send(pattern, element));
        });
    }
}
