import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/user.services';

@ApiTags('Users')
@Controller('test')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('users')
    @ApiOperation({
        summary: 'List of users',
    })
    async findAll() {
        return await this.usersService.getAllUsers();
    }
}
