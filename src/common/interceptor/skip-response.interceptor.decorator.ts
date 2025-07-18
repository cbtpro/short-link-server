import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_INTERCEPTOR_KEY = 'SKIP_RESPONSE_INTERCEPTOR_KEY';

export const SkipResponseInterceptor = () => SetMetadata(SKIP_RESPONSE_INTERCEPTOR_KEY, true);
