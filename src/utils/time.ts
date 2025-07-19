import ms from 'ms';
import type { StringValue } from "ms";

export function getExpireTime(duration: StringValue): { expireDate: Date; expireAt: string; expireInSeconds: number; } {
  const msValue = ms(duration);
  if (typeof msValue !== 'number') {
    throw new Error('Invalid duration format');
  }

  const expireDate = new Date(Date.now() + msValue);
  const expireAt = expireDate.toISOString(); // 或者格式化成其他时间格式
  const expireInSeconds = Math.floor(msValue / 1000);

  return {
    expireDate,
    expireAt,
    expireInSeconds,
  };
}