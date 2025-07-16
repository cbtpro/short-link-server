import { Controller, Get } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('/all')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}