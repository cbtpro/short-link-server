import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { EncryptionService } from '@/services/encryption.service';

export function registerDecryptPlugin(fastify: FastifyInstance, encryptionService: EncryptionService) {
  fastify.addHook('preValidation', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    if (body && typeof body === 'object' && 'ciphertext' in body) {
      try {
        const decrypted = encryptionService.decryptData(body.ciphertext);
        request.body = JSON.parse(decrypted);
      } catch (err) {
        reply.status(400).send({ message: '请求体解密失败' });
        throw err;
      }
    }
  });
}
