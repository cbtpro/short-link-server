import { SetMetadata } from '@nestjs/common';

export const SKIP_ENCRYPTION_INTERCEPTOR_KEY = 'skipEncryptionInterceptor';

export const SkipEncryptionInterceptor = () =>
  SetMetadata(SKIP_ENCRYPTION_INTERCEPTOR_KEY, true);
