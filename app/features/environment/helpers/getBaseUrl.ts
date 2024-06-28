import { config } from '~/config';
import { ifEnv } from '~/features/environment/helpers/ifEnv';

export const getBaseUrl = (environment?: string) => {
  return ifEnv(environment, [
    config.realEnvCoreServiceUrl,
    config.dummyEnvCoreServiceUrl,
    config.coreServiceUrl,
  ]) as string;
};
