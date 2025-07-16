
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(uuid: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ uuid });
  }

  async remove(uuid: number): Promise<void> {
    await this.usersRepository.delete(uuid);
  }
}
