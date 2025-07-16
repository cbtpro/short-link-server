
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: ICat[] = [];

  create(cat: ICat) {
    this.cats.push(cat);
  }

  findAll(): ICat[] {
    return this.cats;
  }
}
