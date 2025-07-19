import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly secrityConfig: ISecrityConfig; // 替换为你的密钥

  constructor(private configService: ConfigService) {
    const config = this.configService.get<ISecrityConfig>('secret');
    if (config) {
      this.secrityConfig = config;
    }
    if (!config) {
      console.warn('SECRET_KEY 未配置，加密功能将无法正常使用');
    }
  }
  encryptData(data: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secrityConfig['secret_key'],
    ).toString();
  }

  decryptData(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secrityConfig['secret_key']);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
