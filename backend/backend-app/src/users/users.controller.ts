import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users - list all users
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // POST /users/seed - create 2 demo users if none exist
  @Post('seed')
  async seed() {
    return this.usersService.createDemoUsers();
  }
}
