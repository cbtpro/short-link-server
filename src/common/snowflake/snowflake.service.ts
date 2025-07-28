import { Injectable } from '@nestjs/common';
import { SnowflakeConfig } from './snowflake.config';
const FlakeId = require('flake-idgen');

@Injectable()
export class SnowflakeService {
  private flake: typeof FlakeId;

  constructor() {
    const { datacenterId, machineId } = SnowflakeConfig;
    // 将数据中心 ID 和机器 ID 组合成 10 位 ID
    const id = ((datacenterId & 0x1f) << 5) | (machineId & 0x1f);

    this.flake = new FlakeId({
      id,
      epoch: 1300000000000, // 自定义起点（如 2021-01-01）
    });
  }

  generateId(): string {
    const buffer = this.flake.next(); // 返回 Buffer
    return BigInt('0x' + buffer.toString('hex')).toString(); // 十六进制转十进制字符串
  }
}
