import { Injectable } from '@nestjs/common';
import FlakeId from 'flake-idgen';

@Injectable()
export class SnowflakeService {
  private flake: FlakeId;

  constructor() {
    const datacenterId = Number(process.env.DATACENTER_ID || 1);
    const machineId = Number(process.env.MACHINE_ID || 1);

    // 将数据中心 ID 和机器 ID 组合成 10 位 ID
    const id = ((datacenterId & 0x1f) << 5) | (machineId & 0x1f);

    this.flake = new FlakeId({
      id,
      epoch: 1609459200000, // 自定义起点（如 2021-01-01）
    });
  }

  generateId(): string {
    const buffer = this.flake.next(); // 返回 Buffer
    return BigInt('0x' + buffer.toString('hex')).toString(); // 十六进制转十进制字符串
  }
}
