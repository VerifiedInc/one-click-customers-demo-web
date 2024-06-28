import { config } from '~/config';
import { ifEnv } from '~/features/environment/helpers/ifEnv';

export const getAdminKey = (environment?: string) => {
  return ifEnv(environment, [
    config.realEnvCoreServiceAdminKey,
    config.dummyEnvCoreServiceAdminKey,
    config.coreServiceAdminAuthKey,
  ]) as string;
};
